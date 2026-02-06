import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET – listar perfumes
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(products)
}

// POST – crear perfume
export async function POST(req: Request) {
  
  const body = await req.json()

  const product = await prisma.product.create({
    data: {
      brand: body.brand,
      name: body.name,
      description: body.description,
      notes: body.notes,
      sizeMl: body.sizeMl,
      price: body.price,
      stock: body.stock,
    }
  })

  return NextResponse.json(product)
}
