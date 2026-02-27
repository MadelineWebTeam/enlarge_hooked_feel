"use client"

import { useState, useTransition } from "react"
import { upsertProduct } from "@/app/admin/products/actions"
import { supabaseBrowser } from "@/lib/supabase-browser"

type ProductVariant = {
  id: number
  sizeMl: number
  price: number
  stock: number
}

type Product = {
  id: number
  brand: string
  name: string
  description?: string | null
  notes?: string | null
  imageUrl?: string | null
  variants: ProductVariant[]
}

export default function ProductForm({ product }: { product?: Product }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl ?? null
  )

  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants?.length
      ? product.variants
      : [
          {
            id: -Date.now(), // ID temporal
            sizeMl: 50,
            price: 0,
            stock: 0,
          },
        ]
  )

  // =============================
  // Imagen
  // =============================

  async function uploadImage(file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `products/${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabaseBrowser.storage
      .from("Madeline_Images")
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })

    if (error) throw error

    const { data } = supabaseBrowser.storage
      .from("Madeline_Images")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // =============================
  // Submit
  // =============================

  async function onSubmit(formData: FormData) {
    try {
      setUploading(true)

      const file = formData.get("image") as File | null

      if (file && file.size > 0) {
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
          alert("La imagen no puede ser mayor a 5MB")
          setUploading(false)
          return
        }

        const imageUrl = await uploadImage(file)
        formData.set("imageUrl", imageUrl)
        formData.delete("image")
      }

      formData.set("variants", JSON.stringify(variants))

      startTransition(async () => {
        await upsertProduct(formData)
      })
    } catch (error) {
      console.error(error)
      alert("Error procesando el producto")
    } finally {
      setUploading(false)
    }
  }

  // =============================
  // UI
  // =============================

  return (
    <form action={onSubmit} className="space-y-4 border p-6 rounded-lg">
      {product && <input type="hidden" name="id" value={product.id} />}

      <input
        name="brand"
        defaultValue={product?.brand}
        placeholder="Marca"
        className="border p-2 w-full rounded"
      />

      <input
        name="name"
        defaultValue={product?.name}
        placeholder="Nombre"
        className="border p-2 w-full rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setPreviewUrl(URL.createObjectURL(file))
        }}
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-32 w-32 object-cover rounded border"
        />
      )}

      <textarea
        name="description"
        defaultValue={product?.description ?? ""}
        placeholder="Descripción"
        className="border p-2 w-full rounded"
      />

      <textarea
        name="notes"
        defaultValue={product?.notes ?? ""}
        placeholder="Notas"
        className="border p-2 w-full rounded"
      />

      <h3 className="font-semibold mt-6">Tamaños disponibles</h3>

      {variants.map((variant, index) => (
        <div
          key={variant.id}
          className="border p-4 rounded space-y-2 bg-gray-50"
        >
          <input
            type="number"
            placeholder="Tamaño (ml)"
            value={variant.sizeMl}
            onChange={(e) => {
              const updated = [...variants]
              updated[index].sizeMl = Number(e.target.value)
              setVariants(updated)
            }}
            className="border p-2 w-full rounded"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={variant.price}
            onChange={(e) => {
              const updated = [...variants]
              updated[index].price = Number(e.target.value)
              setVariants(updated)
            }}
            className="border p-2 w-full rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            value={variant.stock}
            onChange={(e) => {
              const updated = [...variants]
              updated[index].stock = Number(e.target.value)
              setVariants(updated)
            }}
            className="border p-2 w-full rounded"
          />

          <button
            type="button"
            onClick={() =>
              setVariants(variants.filter((_, i) => i !== index))
            }
            className="text-red-600 text-sm"
          >
            Eliminar tamaño
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setVariants([
            ...variants,
            {
              id: -Date.now(),
              sizeMl: 0,
              price: 0,
              stock: 0,
            },
          ])
        }
        className="bg-gray-200 px-4 py-2 rounded"
      >
        + Agregar tamaño
      </button>

      <button
        disabled={uploading || isPending}
        className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {uploading
          ? "Subiendo imagen..."
          : product
          ? "Actualizar producto"
          : "Crear producto"}
      </button>
    </form>
  )
}
