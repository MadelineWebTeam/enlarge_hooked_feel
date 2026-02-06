import { prisma } from "@/lib/prisma"
import ProductsClient from "./ProductsClient"
import type { ProductDTO } from "@/types/product"
export const dynamic = "force-dynamic"


async function getProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return products.map((p) => ({
    ...p,
    price: p.price.toString(),
  }))
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsClient products={products} />
}
