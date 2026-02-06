import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Params = { id: string }

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const body = await req.json()

  const product = await prisma.product.update({
    where: { id: productId },
    data: body,
  })

  return NextResponse.json(product)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  await prisma.product.delete({
    where: { id: productId },
  })

  return NextResponse.json({ success: true })
}
