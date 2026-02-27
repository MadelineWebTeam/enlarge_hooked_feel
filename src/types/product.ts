export type ProductVariantDTO = {
  id: number
  sizeMl: number
  price: number
  stock: number
  sku: string
}

export type ProductDTO = {
  id: number
  brand: string
  name: string
  description: string
  notes: string
  imageUrl?: string | null
  variants: ProductVariantDTO[]
}
