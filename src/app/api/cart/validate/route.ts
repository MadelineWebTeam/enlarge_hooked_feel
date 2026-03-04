import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 })
    }

    let subtotal = 0
    const validatedItems = []

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: Number(item.variantId) },
        include: { product: true },
      })

      if (!variant) continue

      const price = parseFloat(variant.price.toString())
      const lineTotal = price * item.quantity
      subtotal += lineTotal

      validatedItems.push({
        variantId: variant.id,
        name: variant.product.name,
        sizeMl: variant.sizeMl,
        price,
        quantity: item.quantity,
        lineTotal,
      })
    }

    return NextResponse.json({
      items: validatedItems,
      subtotal,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}