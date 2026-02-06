import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProductDTO } from "@/types/product"

export type CartItem = {
  productId: number
  name: string
  price: number
  imageUrl?: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (product: ProductDTO) => void
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

      addItem: (product) => {
        const items = get().items
        const existing = items.find(i => i.productId === product.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.productId === product.id
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
                name: product.name,
                price: Number(product.price),
                imageUrl: product.imageUrl,
                quantity: 1,
              },
            ],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(i => i.productId !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map(i =>
            i.productId === productId
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
