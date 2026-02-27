import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"
import ProductForm from "@/components/ProductForm"
import { mapProductToDTO } from "@/lib/mappers/productMapper"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  const productId = Number(params.id)

  if (isNaN(productId)) {
    throw new Error("ID inválido")
  }

  const productData = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  })

  if (!productData) {
    throw new Error("Producto no encontrado")
  }

  const product = mapProductToDTO(productData)

  return <ProductForm product={product} />
}
