"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cartStore"

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Pago exitoso 🎉</h1>
      <p className="mt-4">Gracias por tu compra.</p>
      <p className="mt-4">Recibiras un correo confirmando tu compra.</p>
    </div>
  )
}
