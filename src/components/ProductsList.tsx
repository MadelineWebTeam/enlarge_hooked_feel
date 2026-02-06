"use client"

import { useOptimistic } from "react"
import { deleteProduct } from "@/actions/product-actions"
import { DeleteProductButton } from "./DeleteProductButton"

type Product = {
  id: number
  name: string
  price: any
}

export function ProductsList({ products }: { products: Product[] }) {
  const [optimisticProducts, removeOptimistic] = useOptimistic(
    products,
    (state, id: number) => state.filter(p => p.id !== id)
  )

  return (
    <ul className="space-y-2">
      {optimisticProducts.map(product => (
        <li
          key={product.id}
          className="flex justify-between border p-2"
        >
          <span>
            {product.name} – ${product.price}
          </span>

          <form
            action={async () => {
              removeOptimistic(product.id) // ⚡ UI inmediata
              await deleteProduct(product.id)
            }}
          >
            <DeleteProductButton />
          </form>
        </li>
      ))}
    </ul>
  )
}
