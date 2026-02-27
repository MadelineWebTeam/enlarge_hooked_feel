import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProductDTO, ProductVariantDTO } from "@/types/product"

export type CartItem = {
  variantId: number
  productId: number
  name: string
  brand: string
  sizeMl: number
  price: number
  imageUrl?: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: ProductDTO, variant: ProductVariantDTO) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        const items = get().items
        const existing = items.find(
          (i) => i.variantId === variant.id
        )

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === variant.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                variantId: variant.id,
                productId: product.id,
                name: product.name,
                brand: product.brand,
                sizeMl: variant.sizeMl,
                price: variant.price,
                imageUrl: product.imageUrl,
                quantity: 1,
              },
            ],
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(
            (i) => i.variantId !== variantId
          ),
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set({
          items: get().items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce(
          (sum, i) => sum + i.quantity,
          0
        ),

      getSubtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
    }),
    {
      name: "madeleine-cart",
    }
  )
)
