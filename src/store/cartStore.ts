import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProductDTO } from "@/types/product"

export type CartItem = {
  productId: number
  variantId: number
  name: string
  sizeMl: number
  price: number
  imageUrl?: string | null
  quantity: number
}


type CartState = {
  items: CartItem[]
  addItem: (product: ProductDTO, variant) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
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
          i => i.variantId === variant.id
        )

        if (existing) {
          set({
            items: items.map(i =>
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
                productId: product.id,
                variantId: variant.id,
                name: product.name,
                sizeMl: variant.sizeMl,
                price: Number(variant.price),
                imageUrl: product.imageUrl,
                quantity: 1,
              },
            ],
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(i => i.variantId !== variantId),
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set({
          items: get().items.map(i =>
            i.variantId === variantId
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "madeleine-cart", // localStorage key
    }
  )
)
