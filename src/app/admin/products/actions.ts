"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"

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
  }
}

export async function upsertProduct(formData: FormData): Promise<ProductFormState> {
  await requireAdmin()

  try {
    const rawId = formData.get("id")
    const id = rawId ? Number(rawId) : null

    const brand = String(formData.get("brand") || "")
    const name = String(formData.get("name") || "")
    const description = String(formData.get("description") || "")
    const notes = String(formData.get("notes") || "")
    const sizeMl = Number(formData.get("sizeMl"))
    const price = Number(formData.get("price"))
    const stock = Number(formData.get("stock"))

    const imageUrl = String(formData.get("imageUrl") || "")

    // ========= VALIDACIONES =========
    const errors: ProductFormState["errors"] = {}

    if (!brand) errors.brand = ["La marca es requerida"]
    if (!name) errors.name = ["El nombre es requerido"]
    if (isNaN(sizeMl) || sizeMl <= 0)
      errors.sizeMl = ["Tamaño inválido"]
    if (isNaN(price) || price <= 0)
      errors.price = ["Precio inválido"]
    if (isNaN(stock) || stock < 0)
      errors.stock = ["Stock inválido"]

    if (Object.keys(errors).length > 0) {
      return { errors }
    }

    const data = {
      brand,
      name,
      description,
      notes,
      sizeMl,
      price,
      stock,
      ...(imageUrl ? { imageUrl } : {}),
    }

    if (id) {
      await prisma.product.update({
        where: { id },
        data,
      })
    } else {
      await prisma.product.create({
        data,
      })
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return {
      success: true,
      message: "Producto actualizado",
      errors: {}
    }
  } catch (err) {
    console.error("upsertProduct error:", err)
    return {
      success: false,
      message: "Error al guardar el producto",
    }
  }
}

// ================= DELETE =================

export async function deleteProduct(productId: number) {
  await requireAdmin()

  await prisma.product.delete({
    where: { id: productId },
  })

  revalidatePath("/admin/products")
}
