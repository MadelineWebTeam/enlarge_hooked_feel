"use client"

import { useCartStore } from "@/store/cartStore"
import type { ProductDTO, ProductVariantDTO } from "@/types/product"

type Props = {
  product: ProductDTO
  variant: ProductVariantDTO
}

export default function AddToCartButton({ product, variant }: Props) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <button
      onClick={() => addItem(product, variant)}
      disabled={variant.stock <= 0}
      className="mt-4 w-full rounded-full bg-[#D4B063] px-4 py-3 font-medium transition hover:opacity-90 disabled:opacity-50"
    >
      {variant.stock > 0 ? "Agregar al carrito" : "Sin stock"}
    </button>
  )
}
