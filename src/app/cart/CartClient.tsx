"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"

export default function CartClient() {
  const { items } = useCartStore()
  const [validatedCart, setValidatedCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function validateCart() {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()
      setValidatedCart(data)
      setLoading(false)
    }

    if (items.length > 0) {
      validateCart()
    } else {
      setLoading(false)
    }
  }, [items])

  if (loading) return <p>Validando carrito...</p>

  if (!validatedCart) return <p>Tu carrito está vacío</p>

  return (
    <div>
      <h1>Tu carrito</h1>

      {validatedCart.items.map((item: any) => (
        <div key={item.variantId}>
          <p>
            {item.name} {item.sizeMl}ml
          </p>
          <p>
            {item.quantity} x ${item.price}
          </p>
          <p>Total: ${item.lineTotal}</p>
        </div>
      ))}

      <h2>Subtotal: ${validatedCart.subtotal}</h2>
    </div>
  )
}