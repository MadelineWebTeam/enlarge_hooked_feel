"use client"

import { useState } from "react"
import AddToCartButton from "./AddToCartButton"
import type { ProductDTO, ProductVariantDTO } from "@/types/product"

type Props = {
  product: ProductDTO
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDTO>(product.variants[0])

  return (
    <div className="space-y-6">

      {/* Selector */}
      <div>
        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
          Tamaño
        </p>

        <div className="flex gap-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              disabled={variant.stock === 0}
              className={`px-4 py-2 rounded-full border text-sm transition
                ${selectedVariant.id === variant.id
                  ? "bg-[#C89A4A] text-white border-[#C89A4A]"
                  : "bg-white border-zinc-300 hover:border-[#C89A4A]"
                }
                ${variant.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {variant.sizeMl}ml
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="flex items-center gap-6">
        <span className="text-3xl font-bold text-[#C89A4A]">
          ${selectedVariant.price.toFixed(2)} MXN
        </span>

        {selectedVariant.stock > 0 ? (
          <span className="text-sm text-green-700">
            Disponible · {selectedVariant.stock}
          </span>
        ) : (
          <span className="text-sm text-red-600">
            Agotado
          </span>
        )}
      </div>

      {/* Ahora sí pasamos product + variant */}
      <AddToCartButton
        product={product}
        variant={selectedVariant}
      />
    </div>
  )
}
