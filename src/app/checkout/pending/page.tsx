"use client"

import Link from "next/link"

export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-600">
          Pago pendiente ⏳
        </h1>

        <p className="mt-4 text-gray-600">
          Tu pago está siendo procesado.
          Te notificaremos cuando sea confirmado.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
