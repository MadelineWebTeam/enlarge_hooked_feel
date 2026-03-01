"use client"

import { useState } from "react"
import Image from "next/image"
import type { ProductDTO, ProductVariantDTO } from "@/types/product"
import VariantSelector from "./VariantSelector"
import AddToCartButton from "./AddToCartButton"

type Props = {
  product: ProductDTO
}

export default function ProductCard({ product }: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDTO>(product.variants[0])

  return (
    <div className="rounded-2xl bg-white p-4 shadow hover:shadow-lg transition">
      
      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-contain"
          />
        )}
      </div>

      {/* Info */}
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase text-zinc-500">
          {product.brand}
        </p>

        <h3 className="font-semibold">
          {product.name}
        </h3>

        {/* Selector */}
        <VariantSelector
          variants={product.variants}
          onChange={setSelectedVariant}
        />

        {/* Precio */}
        <p className="text-lg font-bold text-[#C89A4A]">
          ${selectedVariant.price.toFixed(2)} MXN
        </p>

        {/* Botón */}
        <AddToCartButton
          product={product}
          variant={selectedVariant}
        />
      </div>
    </div>
  )
}
