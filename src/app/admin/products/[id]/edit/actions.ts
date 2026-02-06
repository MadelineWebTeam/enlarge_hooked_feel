"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"
import { revalidatePath } from "next/cache"
import { supabaseServer } from "@/lib/supabaseServer"
import { getStoragePathFromUrl } from "@/lib/supabaseUtils"
import type { ProductFormState } from "./types"

export async function upsertProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin()

  try {
    const id = formData.get("id")

    const brand = String(formData.get("brand") || "")
    const name = String(formData.get("name") || "")
    const description = String(formData.get("description") || "")
    const notes = String(formData.get("notes") || "")
    const sizeMl = Number(formData.get("sizeMl"))
    const price = Number(formData.get("price"))
    const stock = Number(formData.get("stock"))

    const imageFile = formData.get("image") as File | null
    const file =
      imageFile instanceof File && imageFile.size > 0
        ? imageFile
        : null

    // =============================
    // ✅ VALIDACIONES
    // =============================
    const errors: ProductFormState["errors"] = {}

    if (!brand) errors.brand = ["La marca es requerida"]
    if (!name) errors.name = ["El nombre es requerido"]
    if (isNaN(sizeMl) || sizeMl <= 0)
      errors.sizeMl = ["Tamaño inválido"]
    if (isNaN(price) || price <= 0)
      errors.price = ["Precio inválido"]
    if (isNaN(stock) || stock < 0)
      errors.stock = ["Stock inválido"]

    if (file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        errors.image = ["La imagen no puede ser mayor a 5MB"]
      }
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    // =============================
    // 🖼️ MANEJO DE IMAGEN
    // =============================
    let imageUrl: string | undefined = undefined

    if (file) {
      let oldImageUrl: string | null = null

      if (id) {
        const existing = await prisma.product.findUnique({
          where: { id: Number(id) },
          select: { imageUrl: true },
        })

        oldImageUrl = existing?.imageUrl ?? null
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      console.log("⬆️ Uploading file:", file.name, file.size)

      const { error: uploadError } = await supabaseServer.storage
        .from("Madeline_Images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        console.error("❌ SUPABASE UPLOAD ERROR:", uploadError)
        return {
          success: false,
          message: "Error subiendo imagen a Supabase",
        }
      }

      const { data } = supabaseServer.storage
        .from("Madeline_Images")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl

      console.log("✅ Public URL:", imageUrl)

      // 🗑️ Borrar imagen vieja
      if (oldImageUrl) {
        const oldPath = getStoragePathFromUrl(oldImageUrl)
        if (oldPath) {
          await supabaseServer.storage
            .from("Madeline_Images")
            .remove([oldPath])
        }
      }
    }

    // =============================
    // 💾 DB
    // =============================
    const data: any = {
      brand,
      name,
      description,
      notes,
      sizeMl,
      price,
      stock,
    }

    if (imageUrl) {
      data.imageUrl = imageUrl
    }

    if (id) {
      await prisma.product.update({
        where: { id: Number(id) },
        data,
      })
    } else {
      await prisma.product.create({
        data: {
          ...data,
          imageUrl: imageUrl ?? null,
        },
      })
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return {
      success: true,
      message: "Producto guardado correctamente",
    }
  } catch (err) {
    console.error("🔥 UPSERT ERROR:", err)
    return {
      success: false,
      message: "Error al guardar producto",
    }
  }
}
