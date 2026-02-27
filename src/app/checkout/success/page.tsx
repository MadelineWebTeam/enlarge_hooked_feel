"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCartStore } from "@/store/cartStore"

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart)
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderId = searchParams.get("external_reference")

    if (orderId) {
      clearCart()
    }
  }, [clearCart, searchParams])

  return <div>Pago confirmado 🎉</div>
}
