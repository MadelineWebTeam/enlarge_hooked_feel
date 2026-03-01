"use client"

import { useState, useEffect } from "react"
import type { ProductVariantDTO } from "@/types/product"

type Props = {
  variants: ProductVariantDTO[]
  onChange: (variant: ProductVariantDTO) => void
}

export default function VariantSelector({ variants, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<number>(variants[0]?.id)

  useEffect(() => {
    const variant = variants.find(v => v.id === selectedId)
    if (variant) onChange(variant)
  }, [selectedId, variants, onChange])

  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <button
          key={variant.id}
          onClick={() => setSelectedId(variant.id)}
          className={`rounded-full border px-3 py-1 text-sm transition ${
            selectedId === variant.id
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          {variant.sizeMl}ml
        </button>
      ))}
    </div>
  )
}