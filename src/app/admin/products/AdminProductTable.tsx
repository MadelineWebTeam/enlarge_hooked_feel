"use client"

import type { ProductDTO } from "@/types/product"

export default function AdminProductTable({
  products,
}: {
  products: ProductDTO[]
}) {
  return (
    <>
      {products.map((p) => {
        const minPrice =
          p.variants.length > 0
            ? Math.min(...p.variants.map((v) => v.price))
            : 0

        return (
          <div key={p.id} className="border p-4 rounded mb-3">
            <p className="font-semibold">
              {p.brand} {p.name}
            </p>

            <p className="text-sm text-gray-500">
              {p.variants.length} tamaños
            </p>

            <p className="font-bold">
              Desde ${minPrice.toFixed(2)}
            </p>
          </div>
        )
      })}
    </>
  )
}
