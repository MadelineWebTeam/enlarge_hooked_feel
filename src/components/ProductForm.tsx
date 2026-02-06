"use client"

import { useState, useTransition } from "react"
import { upsertProduct } from "@/app/admin/products/actions"
import { supabaseBrowser } from "@/lib/supabase-browser"
import type { ProductFormState } from "@/app/admin/products/[id]/edit/types"

const initialState: ProductFormState = {}

type Product = {
  id: number
  brand: string
  name: string
  description?: string | null
  notes?: string | null
  sizeMl: number
  price: number
  stock: number
  imageUrl?: string | null
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, setState] = useState<ProductFormState>(initialState)
  const [isPending, startTransition] = useTransition()

  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl || null
  )

  async function uploadImage(file: File) {
    console.log("SUPABASE ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log(
      "SUPABASE ENV ANON:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)
    )

    const fileExt = file.name.split(".").pop()
    const fileName = `products/${crypto.randomUUID()}.${fileExt}`

    const { data, error } = await supabaseBrowser.storage
      .from("Madeline_Images")
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })

    console.log("UPLOAD DATA:", data)
    console.log("UPLOAD ERROR:", error)

    if (error) throw error

    const { data: publicData } = supabaseBrowser.storage
      .from("Madeline_Images")
      .getPublicUrl(fileName)

    console.log("PUBLIC DATA:", publicData)

    return publicData.publicUrl
  }

  async function onSubmit(formData: FormData) {
    try {
      setUploading(true)

      const file = formData.get("image") as File | null

      if (file && file.size > 0) {
        const maxSize = 5 * 1024 * 1024 // 5MB
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
      {product && (
        <input type="hidden" name="id" value={product.id} />
      )}

      <input
        name="brand"
        defaultValue={product?.brand}
        placeholder="Marca"
      />
      {state?.errors?.brand && (
        <p className="text-red-600 text-sm">{state.errors.brand[0]}</p>
      )}

      <input
        name="name"
        defaultValue={product?.name}
        placeholder="Nombre"
      />
      {state?.errors?.name && (
        <p className="text-red-600 text-sm">{state.errors.name[0]}</p>
      )}

      {/* IMAGE */}
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const localUrl = URL.createObjectURL(file)
            setPreviewUrl(localUrl)
          }
        }}
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-32 w-32 object-cover rounded border"
        />
      )}

      <p>description</p>
      <input
        name="description"
        defaultValue={product?.description || ""}
        placeholder="Descripción"
      />

      <p>notes</p>
      <input
        name="notes"
        defaultValue={product?.notes || ""}
        placeholder="Notas"
      />

      <p>size</p>
      <input
        name="sizeMl"
        type="number"
        defaultValue={product?.sizeMl}
        placeholder="Tamaño (ml)"
      />
      {state?.errors?.sizeMl && (
        <p className="text-red-600 text-sm">{state.errors.sizeMl[0]}</p>
      )}

      <p>price</p>
      <input
        name="price"
        type="number"
        step="0.01"
        defaultValue={product?.price}
        placeholder="Precio"
      />
      {state?.errors?.price && (
        <p className="text-red-600 text-sm">{state.errors.price[0]}</p>
      )}

      <p>stock</p>
      <input
        name="stock"
        type="number"
        defaultValue={product?.stock}
        placeholder="Stock"
      />
      {state?.errors?.stock && (
        <p className="text-red-600 text-sm">{state.errors.stock[0]}</p>
      )}

      {state?.message && (
        <p
          className={`text-sm ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

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
