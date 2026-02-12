"use client"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"
import ProductForm from "@/components/ProductForm"

export default async function EditProductPage({params}: {params: Promise<{ id: string }>}) {
  await requireAdmin()

  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId)) {
    throw new Error("ID inválido")
  }

  const productData = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!productData) {
    throw new Error("Producto no encontrado")
  }

  const product = {
    ...productData,
    price: Number(productData.price),
    brand: productData.brand ?? "",
    description: productData.description ?? "",
    notes: productData.notes ?? "",
  }

  return (
    <ProductForm product={product} />
  )
}