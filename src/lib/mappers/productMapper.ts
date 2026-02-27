import { Product, ProductVariant } from "@prisma/client"
import { ProductDTO } from "@/types/product"

type ProductWithVariants = Product & {
  variants: ProductVariant[]
}

export function mapProductToDTO(
  product: ProductWithVariants
): ProductDTO {
  return {
    id: product.id,
    brand: product.brand ?? "",
    name: product.name,
    description: product.description ?? "",
    notes: product.notes ?? "",
    imageUrl: product.imageUrl,
    variants: product.variants.map((v) => ({
      id: v.id,
      sizeMl: v.sizeMl,
      price: Number(v.price), // 🔥 conversión centralizada
      stock: v.stock,
      sku: v.sku,
    })),
  }
}
