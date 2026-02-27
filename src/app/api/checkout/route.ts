import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const body = await req.json()
  const items = body.items

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })
  }

  // 🔥 Obtener variantes reales desde DB
  const variantIds = items.map((item: any) => item.variantId)

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
    },
    include: {
      product: true,
    },
  })

  // 🔥 Construir line_items para Stripe
  const line_items = items.map((item: any) => {
    const variant = variants.find(v => v.id === item.variantId)

    if (!variant) {
      throw new Error("Variante no encontrada")
    }

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${variant.product.brand} ${variant.product.name} ${variant.sizeMl}ml`,
          images: variant.product.imageUrl
            ? [variant.product.imageUrl]
            : [],
        },
        unit_amount: Math.round(Number(variant.price) * 100),
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: {
      items: JSON.stringify(items), // 🔥 importante para webhook
    },
  })

  return NextResponse.json({ url: session.url })
}
