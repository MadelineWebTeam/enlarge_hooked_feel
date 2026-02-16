"use client"

export default function BuyButton({ items }: { items: any[] }) {
  const handleCheckout = async () => {
    console.log("CART ITEMS:", items)

    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Error:", data)
      alert("Error al crear la preferencia")
      return
    }

    window.location.href = data.init_point
  }

  return (
    <button
      onClick={handleCheckout}
      className="bg-black text-white px-6 py-3 rounded"
    >
      Pagar carrito
    </button>
  )
}
