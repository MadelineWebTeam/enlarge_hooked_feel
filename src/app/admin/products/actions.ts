"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"
import { Prisma } from "@prisma/client"

export async function upsertProduct(formData: FormData) {
  await requireAdmin()

  const id = formData.get("id")
  const brand = String(formData.get("brand") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "")
  const notes = String(formData.get("notes") || "")
  const imageUrl = String(formData.get("imageUrl") || "")

  const variantsRaw = formData.get("variants")
  const variants = variantsRaw
    ? JSON.parse(String(variantsRaw))
    : []

  if (!brand || !name) {
    throw new Error("Marca y nombre son obligatorios")
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error("Debes agregar al menos una variante")
  }

  return await prisma.$transaction(async (tx) => {
    let product

    // =============================
    // CREATE
    // =============================
    if (!id) {
      product = await tx.product.create({
        data: {
          brand,
          name,
          description,
          notes,
          imageUrl,
        },
      })
    }

    // =============================
    // UPDATE
    // =============================
    else {
      const productId = Number(id)

      product = await tx.product.update({
        where: { id: productId },
        data: {
          brand,
          name,
          description,
          notes,
          imageUrl,
        },
      })

      const existingVariants = await tx.productVariant.findMany({
        where: { productId },
      })

      const existingIds = existingVariants.map(v => v.id)
      const incomingIds = variants
        .filter((v: any) => v.id > 0)
        .map((v: any) => v.id)

      const toDelete = existingIds.filter(
        id => !incomingIds.includes(id)
      )

      if (toDelete.length > 0) {
        await tx.productVariant.deleteMany({
          where: { id: { in: toDelete } },
        })
      }
    }

    const productId = product.id

    // =============================
    // VALIDAR DUPLICADOS EN REQUEST
    // =============================
    const sizeSet = new Set<number>()
    for (const v of variants) {
      if (sizeSet.has(Number(v.sizeMl))) {
        throw new Error("No puedes repetir tamaños de perfume")
      }
      sizeSet.add(Number(v.sizeMl))
    }

    // =============================
    // UPSERT VARIANTS
    // =============================
    for (const variant of variants) {
      const sizeMl = Number(variant.sizeMl)
      const price = new Prisma.Decimal(variant.price)
      const stock = Number(variant.stock)

      if (!sizeMl || price.lessThanOrEqualTo(0)) {
        throw new Error("Tamaño y precio son obligatorios")
      }

      // 🔥 SKU automático
      const sku = `${brand}-${name}-${sizeMl}ML`
        .toUpperCase()
        .replace(/\s+/g, "-")

      try {
        // 🔹 Nueva variante
        if (variant.id < 0) {
          await tx.productVariant.create({
            data: {
              productId,
              sizeMl,
              price,
              stock,
              sku,
            },
          })
        }

        // 🔹 Variante existente
        else {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              sizeMl,
              price,
              stock,
              sku,
            },
          })
        }
      } catch (error: any) {
        // 🔥 Captura error de tamaño duplicado (constraint @@unique)
        if (error.code === "P2002") {
          throw new Error(
            `Ya existe una variante de ${sizeMl}ml para este perfume`
          )
        }
        throw error
      }
    }

    return { success: true }
  })
}
