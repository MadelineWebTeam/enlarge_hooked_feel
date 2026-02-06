export type ProductFormState = {
  success?: boolean
  message?: string
  errors?: {
    brand?: string[]
    name?: string[]
    description?: string[]
    notes?: string[]
    sizeMl?: string[]
    price?: string[]
    stock?: string[]
    image?: string[]
  }
}
