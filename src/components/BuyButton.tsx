"use client"

import { useState } from "react"

type CartItem = {
  variantId: number
  quantity: number
}

type Customer = {
  fullName: string
  email: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country?: string
}

interface BuyButtonProps {
  items: CartItem[]
  customer: Customer
  disabled?: boolean
}

export default function BuyButton({
  items,
  customer,
  disabled = false,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  const safeItems = items.map(item => ({
      variantId: Number(item.variantId),
      quantity: Number(item.quantity)
    }))
    .filter(item =>
      !isNaN(item.variantId) &&
      item.variantId > 0 &&
      !isNaN(item.quantity) &&
      item.quantity > 0
    )

  const handleCheckout = async () => {
    if (disabled) {
      alert("Completa los datos de envío")
      return
    }

    if (loading) return

    try {
      setLoading(true)

      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
           items: safeItems,
          customer
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result?.error || "Error al iniciar el pago")
      }

      if (!result.init_point) {
        throw new Error("Respuesta inválida del servidor")
      }

      window.location.href = result.init_point
    } catch (error: any) {
      console.error("Checkout error:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
    >
      {loading ? "Redirigiendo..." : "Finalizar compra"}
    </button>
  )
}