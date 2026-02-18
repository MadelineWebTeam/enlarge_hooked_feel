"use client"

import Image from "next/image"
import Link from "next/link"
import BuyButton from "@/components/BuyButton"
import { useCartStore } from "@/store/cartStore"
import { useState } from "react"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const isFormValid = () => {
    return (
      customer.fullName &&
      customer.email &&
      customer.addressLine1 &&
      customer.city &&
      customer.state &&
      customer.postalCode
    )
  }

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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value)

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-zinc-600">
          Agrega algunos perfumes para continuar.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-black px-6 py-2 text-sm text-white"
        >
          Ver perfumes
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Tu carrito</h1>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        {/* Lista de items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-xl border p-4"
            >
              {/* Imagen */}
              {item.imageUrl && (
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-sm text-zinc-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Cantidad */}
                  <div className="flex items-center rounded-full border">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-1 text-sm"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Total por item */}
              <div className="text-right text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-xl border p-6">
          <h2 className="mb-4 text-lg font-semibold">Resumen</h2>

          <div className="mb-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">
              {formatCurrency(getSubtotal())}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold">Datos de envío</h2>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Nombre completo"
              value={customer.fullName}
              onChange={(e) =>
                setCustomer({ ...customer, fullName: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Correo electrónico"
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Número de teléfono"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Dirección (calle y número)"
              value={customer.addressLine1}
              onChange={(e) =>
                setCustomer({ ...customer, addressLine1: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Departamento, interior (opcional)"
              value={customer.addressLine2}
              onChange={(e) =>
                setCustomer({ ...customer, addressLine2: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2"
                placeholder="Ciudad"
                value={customer.city}
                onChange={(e) =>
                  setCustomer({ ...customer, city: e.target.value })
                }
              />

              <input
                className="border rounded px-3 py-2"
                placeholder="Estado"
                value={customer.state}
                onChange={(e) =>
                  setCustomer({ ...customer, state: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2"
                placeholder="Código postal"
                value={customer.postalCode}
                onChange={(e) =>
                  setCustomer({ ...customer, postalCode: e.target.value })
                }
              />

              <input
                className="border rounded px-3 py-2"
                placeholder="País"
                value={customer.country}
                onChange={(e) =>
                  setCustomer({ ...customer, country: e.target.value })
                }
              />
            </div>
          </div>


          <BuyButton
            items={items.map((item) => ({
              id: item.productId,
              name: item.name,
              price: Number(item.price),
              quantity: item.quantity,
            }))}
            customer={customer}
            disabled={!isFormValid()}
          />

          <button
            onClick={clearCart}
            className="mt-3 w-full text-xs text-zinc-500 hover:underline"
          >
            Vaciar carrito
          </button>
        </aside>
      </div>
    </main>
  )
}
