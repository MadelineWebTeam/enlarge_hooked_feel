import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { items } = await req.json()

  const validatedItems = []
  let subtotal = 0

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true }
    })

    if (!variant) continue

    const price = Number(variant.price)
    const lineTotal = price * item.quantity
    subtotal += lineTotal

    validatedItems.push({
      variantId: variant.id,
      name: variant.product.name,
      brand: variant.product.brand,
      sizeMl: variant.sizeMl,
      price,
      quantity: item.quantity,
      lineTotal
    })
  }

  return NextResponse.json({
    items: validatedItems,
    subtotal
  })
}