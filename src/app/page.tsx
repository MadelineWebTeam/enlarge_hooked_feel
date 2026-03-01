import HomeClient from "../components/HomeClient"
import { prisma } from "@/lib/prisma"
import type { ProductDTO } from "@/types/product"

async function getProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return products.map((p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    description: p.description,
    notes: p.notes,
    imageUrl: p.imageUrl,

    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      sizeMl: v.sizeMl,
      price: Number(v.price),
      stock: v.stock,
    })),
  }))
}

export default async function HomePage() {
  const products = await getProducts()
  return <HomeClient products={products} />
}
