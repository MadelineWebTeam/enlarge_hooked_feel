"use client"

import Link from "next/link"

export default function FailurePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Pago rechazado ❌
        </h1>

        <p className="mt-4 text-gray-600">
          Tu pago no pudo procesarse.
          Puedes intentarlo nuevamente.
        </p>

        <div className="mt-6">
          <Link
            href="/cart"
            className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
          >
            Volver al carrito
          </Link>
        </div>
      </div>
    </div>
  )
}
