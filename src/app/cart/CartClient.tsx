"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import BuyButton from "@/components/BuyButton"

export default function CartClient() {
  const { items, updateQuantity, removeItem } = useCartStore()

  const [validatedCart, setValidatedCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "México",
  })

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
      setValidatedCart(null)
      setLoading(false)
    }
  }, [items])

  if (loading) return <p>Validando carrito...</p>

  if (!validatedCart || validatedCart.items.length === 0)
    return <p>Tu carrito está vacío</p>

  const isFormValid =
    customer.fullName &&
    customer.email &&
    customer.addressLine1 &&
    customer.city &&
    customer.state &&
    customer.postalCode

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tu carrito</h1>

      {/* ITEMS */}
      {validatedCart.items.map((item: any) => (
        <div
          key={item.variantId}
          className="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">
              {item.name} {item.sizeMl}ml
            </p>
            <p>${item.price} MXN</p>
            <p>Total: ${item.lineTotal}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(item.variantId, item.quantity - 1)
              }
              className="px-3 py-1 border rounded"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQuantity(item.variantId, item.quantity + 1)
              }
              className="px-3 py-1 border rounded"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item.variantId)}
              className="ml-4 text-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      {/* SUBTOTAL */}
      <div className="text-right text-xl font-semibold">
        Subtotal: ${validatedCart.subtotal} MXN
      </div>

      {/* FORMULARIO */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Datos de envío</h2>

        {Object.keys(customer).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={(customer as any)[key]}
            onChange={(e) =>
              setCustomer({
                ...customer,
                [key]: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          />
        ))}
      </div>

      {/* BOTÓN PAGAR */}
      <BuyButton
        items={items}
        customer={customer}
        disabled={!isFormValid}
      />
    </div>
  )
}