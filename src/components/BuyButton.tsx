"use client"

export default function BuyButton({
  items,
  customer,
  disabled,
}: {
  items: any[]
  customer: any
  disabled?: boolean
}) {
  const handleCheckout = async () => {
    if (disabled) {
      alert("Completa los datos de envío")
      return
    }

    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customer }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert("Error al crear la preferencia")
      return
    }

    window.location.href = data.init_point
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled}
      className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
    >
      Finalizar compra
    </button>
  )
}
