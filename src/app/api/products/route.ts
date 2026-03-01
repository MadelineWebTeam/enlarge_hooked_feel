import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  const body = await req.json()
  const sku = `${body.brand}-${body.name}-${body.sizeMl}`
  .replace(/\s+/g, "-")
  .toUpperCase()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      notes: body.notes,
      brand: body.brand,
      imageUrl: body.imageUrl,

      variants: {
        create: [
          {
            sku,
            sizeMl: Number(body.sizeMl),
            price: new Prisma.Decimal(body.price),
            stock: Number(body.stock),
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  })

  return NextResponse.json(product)
}
