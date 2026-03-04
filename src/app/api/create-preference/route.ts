import { MercadoPagoConfig, Preference } from "mercadopago"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { items, customer } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío" },
        { status: 400 }
      )
    }
    
    // Customer validation
    if (
      !customer?.fullName ||
      !customer?.email ||
      !customer?.addressLine1 ||
      !customer?.city ||
      !customer?.state ||
      !customer?.postalCode
    ) {
      return NextResponse.json(
        { error: "Datos de envío incompletos" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    /**
     * ===========================
     * CART VALIDATION SAFE ZONE
     * ===========================
     */

    let subtotal = 0
    const validatedItems: any[] = []

    for (const item of items) {
      if (!item.variantId || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Item inválido" },
          { status: 400 }
        )
      }

      // 🔥 Fetch latest variant snapshot
      const variant = await prisma.productVariant.findUnique({
        where: { id: Number(item.variantId) },
        include: { product: true },
      })

      if (!variant) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 400 }
        )
      }

      // Stock validation
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para ${variant.product.name}`,
          },
          { status: 400 }
        )
      }

      const price = Number(variant.price)

      subtotal += price * item.quantity

      validatedItems.push({
        title: `${variant.product.name} ${variant.sizeMl}ml`,
        quantity: item.quantity,
        unit_price: price,
        currency_id: "MXN",
        id: String(variant.id),
      })
      console.log("SUBTOTAL FINAL:", subtotal)
      console.log("ITEMS ENVIADOS A MP:", validatedItems)
    }

    /**
     * ===========================
     * CREATE ORDER (IDEMPOTENT)
     * ===========================
     */

    const order = await prisma.order.create({
      data: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone ?? null,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2 ?? null,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        country: customer.country ?? "México",

        subtotal,
        total: subtotal,
        status: "PENDING",

        items: {
          create: validatedItems.map(item => ({
            name: item.title,
            variantId: Number(item.id),
            quantity: item.quantity,
            price: item.unit_price,
          })),
        },
      },
    })

    /**
     * ===========================
     * CREATE MERCADOPAGO PREF
     * ===========================
     */

    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: validatedItems,

        external_reference: String(order.id),

        payer: {
          name: customer.fullName,
          email: customer.email,
        },

        auto_return: "approved",

        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
        },
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoPreferenceId: response.id,
      },
    })

    return NextResponse.json({
      init_point: response.init_point,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Checkout error" },
      { status: 500 }
    )
  }
}
