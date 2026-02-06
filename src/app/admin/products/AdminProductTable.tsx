"use client"

export default function AdminProductTable({ products }: { products: any[] }) {
  return (
    <>
      {products.map((p) => (
        <div key={p.id}>
          <p>{p.name}</p>
          <p>${p.price}</p>
        </div>
      ))}
    </>
  )
}
