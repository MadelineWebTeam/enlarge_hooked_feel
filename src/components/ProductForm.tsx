"use client"

import { useState, useTransition } from "react"
import { upsertProduct } from "@/app/admin/products/actions"
import { supabaseBrowser } from "@/lib/supabase-browser"
import type { ProductFormState } from "@/app/admin/products/[id]/edit/types"

const initialState: ProductFormState = {}

type ProductVariant = {
  id: number
  sizeMl: number
  price: number
  stock: number
  productId: number
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
  const [state, setState] = useState<ProductFormState>(initialState)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl || null
  )

  // ✅ AHORA SÍ dentro del componente
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants?.length
      ? product.variants
      : [{ id: 0, sizeMl: 50, price: 0, stock: 0, productId: product?.id || 0 }]
  )

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

      startTransition(async () => {
        formData.set("variants", JSON.stringify(variants))
        const result = await upsertProduct(formData)
        setState(result)
      })
    } catch (err) {
      console.error("Upload error:", err)
      alert("Error subiendo imagen")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-3 border p-4 rounded">
      {product && <input type="hidden" name="id" value={product.id} />}

      <input name="brand" defaultValue={product?.brand} placeholder="Marca" />
      <input name="name" defaultValue={product?.name} placeholder="Nombre" />

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

      <input
        name="description"
        defaultValue={product?.description || ""}
        placeholder="Descripción"
      />

      <input
        name="notes"
        defaultValue={product?.notes || ""}
        placeholder="Notas"
      />

      <p className="font-semibold mt-4">Tamaños</p>

      {variants.map((variant, index) => (
        <div key={index} className="border p-3 rounded space-y-2">
          <input
            type="number"
            placeholder="Tamaño (ml)"
            value={variant.sizeMl}
            onChange={(e) => {
              const updated = [...variants]
              updated[index].sizeMl = Number(e.target.value)
              setVariants(updated)
            }}
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
            { id: 0, sizeMl: 0, price: 0, stock: 0, productId: product?.id || 0 }
          ])
        }
        className="bg-gray-200 px-3 py-1 rounded"
      >
        + Agregar tamaño
      </button>

      <button
        disabled={uploading || isPending}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {uploading
          ? "Subiendo imagen..."
          : product
          ? "Actualizar"
          : "Crear"}
      </button>
    </form>
  )
}
