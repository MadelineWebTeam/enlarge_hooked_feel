export type ProductDTO = {
  id: number
  brand: string | null
  name: string
  description: string | null
  notes: string | null
  imageUrl?: string | null
  variants: [
    { id: number, sizeMl: number, price: string, stock: number }
  ]
}

export type ProductFormState = {
  errors?: {
    brand?: string[];
    name?: string[];
    description?: string[];
    notes?: string[];
    sizeMl?: string[];
    price?: string[];
    stock?: string[];
    imageUrl?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
}