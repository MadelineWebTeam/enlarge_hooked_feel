import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  variantId: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (variantId: number) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (variantId) => {
        const items = get().items
        const existing = items.find(i => i.variantId === variantId)

        if (existing) {
          set({
            items: items.map(i =>
              i.variantId === variantId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({
            items: [...items, { variantId, quantity: 1 }]
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(i => i.variantId !== variantId)
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
          )
        })
      },

      clearCart: () => set({ items: [] })
    }),
    { name: "madeleine-cart" }
  )
)