"use client"

export default function BuyButton({ product }: { product: any }) {
  const handleCheckout = async () => {
    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: product.name,
        price: product.price,
      }),
    })

    const data = await res.json()
    window.location.href = data.init_point
  }

  return (
    <button
      className="bg-indigo-600 text-white px-4 py-2 rounded"
      onClick={handleCheckout}
    >
      Comprar ahora
    </button>
  )
}
