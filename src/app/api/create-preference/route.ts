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

    // 🔒 1. Validar items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío" },
        { status: 400 }
      )
    }

    // 🔒 2. Validar cliente
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

    // Validar email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    let subtotal = 0

    // 🔒 3. Validar productos contra base de datos
    const validatedItems = []

    for (const item of items) {
      if (!item.productId || !item.variantId || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Item inválido" },
          { status: 400 }
        )
      }

      const variant = await prisma.productVariant.findUnique({
        where: { id: Number(item.variantId) },
        include: {
          product: true
        }
      })

      if (!variant) {
        return NextResponse.json(
          { error: "Variante no encontrada" },
          { status: 400 }
        )
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${variant.product.name} ${variant.sizeMl}ml` },
          { status: 400 }
        )
      }

      const price = Number(variant.price)

      subtotal += price * item.quantity

      validatedItems.push({
        id: String(variant.id),
        title: `${variant.product.name} ${variant.sizeMl}ml`,
        quantity: item.quantity,
        unit_price: price,
        currency_id: "MXN",
      })
}


    // 🔥 4. Crear Order en DB
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
          create: validatedItems.map((item, index) => ({
            name: item.title,
            productId: Number(items[index].productId),
            variantId: Number(items[index].variantId),
            quantity: items[index].quantity,
            price: item.unit_price,
          })),
        },
      },
    })

    // 🔥 5. Crear preferencia MercadoPago
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: validatedItems,
        external_reference: String(order.id), 
        auto_return: "approved",
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
        },
      },
    })

    // Guardar preferenceId
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
      { error: "Error creando preferencia" }
    )
  }
}
