import HomeClient from "../components/HomeClient"
import { prisma } from "@/lib/prisma"
import type { ProductDTO } from "@/types/product"

async function getProducts(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return products.map((p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    description: p.description,
    notes: p.notes,
    sizeMl: p.sizeMl,
    price: p.price.toString(),
    stock: p.stock,
    imageUrl: p.imageUrl,
  }))
}

export default async function HomePage() {
  const products = await getProducts()

  return <HomeClient products={products} />
}