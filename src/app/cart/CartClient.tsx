"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import BuyButton from "@/components/BuyButton"

const fieldLabels: Record<string, string> = {
  fullName: "Nombre completo",
  email: "Email",
  phone: "Teléfono",
  addressLine1: "Dirección",
  addressLine2: "Depto / piso (opcional)",
  city: "Ciudad",
  state: "Estado",
  postalCode: "Código postal",
  country: "País",
}

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

  const inputClass =
    "w-full rounded-xl border border-[#E4D4B4] bg-white px-4 py-2.5 text-sm text-[#2B2219] placeholder:text-[#8B6A3F] outline-none focus:border-[#D4B063] transition"

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0C89A] flex items-center justify-center">
        <p className="text-sm text-[#5B4A36]">Validando carrito...</p>
      </div>
    )
  }

  if (!validatedCart || validatedCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#E0C89A] flex items-center justify-center px-4">
        <div className="rounded-3xl bg-[#FDF9F2] p-8 shadow-[0_12px_32px_rgba(58,33,20,0.15)] text-center space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8B6A3F]">
            Carrito
          </p>
          <p className="text-lg font-semibold text-[#2B2219]">Tu carrito está vacío</p>
          <p className="text-sm text-[#5B4A36]">Agrega fragancias para continuar.</p>
        </div>
      </div>
    )
  }

  const isFormValid =
    customer.fullName &&
    customer.email &&
    customer.addressLine1 &&
    customer.city &&
    customer.state &&
    customer.postalCode

  return (
    <div className="min-h-screen bg-[#E0C89A] font-sans text-[#2B2219]">
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">

        {/* Título */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8B6A3F]">
            Madeline Scent
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Tu carrito</h1>
        </div>

        {/* Items */}
        <section className="rounded-3xl bg-[#FDF9F2] p-5 shadow-[0_12px_32px_rgba(58,33,20,0.15)] sm:p-7 space-y-4">
          {validatedCart.items.map((item: any) => (
            <div
              key={item.variantId}
              className="flex items-center justify-between rounded-2xl border border-[#E4D4B4] bg-white p-4"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">
                  {item.name} {item.sizeMl}ml
                </p>
                <p className="text-xs text-[#5B4A36]">${item.price} MXN c/u</p>
                <p className="text-xs font-medium text-[#8B6A3F]">
                  Subtotal: ${item.lineTotal} MXN
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-[#E4D4B4] bg-white text-sm font-medium text-[#2B2219] transition hover:bg-[#F5ECD8]"
                >
                  −
                </button>

                <span className="w-5 text-center text-sm font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-[#E4D4B4] bg-white text-sm font-medium text-[#2B2219] transition hover:bg-[#F5ECD8]"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="ml-3 rounded-full border border-[#E4D4B4] px-3 py-1 text-xs text-[#8B6A3F] transition hover:border-[#C89A4A] hover:text-[#2B2219]"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex justify-end pt-2">
            <p className="text-base font-semibold text-[#2B2219]">
              Total: ${validatedCart.subtotal} MXN
            </p>
          </div>
        </section>

        {/* Formulario de envío */}
        <section className="rounded-3xl bg-[#FDF9F2] p-5 shadow-[0_12px_32px_rgba(58,33,20,0.12)] sm:p-7 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Datos de envío</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.keys(customer).map((key) => (
              <div key={key} className={key === "addressLine1" || key === "fullName" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs font-medium text-[#8B6A3F]">
                  {fieldLabels[key] ?? key}
                </label>
                <input
                  placeholder={fieldLabels[key] ?? key}
                  value={(customer as any)[key]}
                  onChange={(e) =>
                    setCustomer({ ...customer, [key]: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Botón pagar */}
        <div className={!isFormValid ? "opacity-60" : ""}>
          <BuyButton items={items} customer={customer} disabled={!isFormValid} />
        </div>

      </main>
    </div>
  )
}
