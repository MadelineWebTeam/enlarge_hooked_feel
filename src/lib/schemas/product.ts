import { z } from "zod"

export const productSchema = z.object({
  id: z.coerce.number().optional(),

  brand: z.string().min(1, "La marca es requerida"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1),
  notes: z.string().min(1),

  sizeMl: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
})

export type ProductInput = z.infer<typeof productSchema>
