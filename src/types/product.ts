export type ProductVariantDTO = {
  id: number
  sku: string
  sizeMl: number
  price: number
  stock: number
}

export type ProductDTO = {
  id: number
  name: string
  brand: string | null
  description: string | null
  notes: string | null
  imageUrl: string | null
  variants: ProductVariantDTO[]
}
