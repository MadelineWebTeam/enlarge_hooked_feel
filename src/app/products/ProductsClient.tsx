"use client";

import type { ProductDTO } from "@/types/product"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"



export default function ProductsClient({
  products,
}: {
  products: ProductDTO[];
}) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: ProductDTO) => {
    addItem(product)
    }

  const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value));

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Perfumes disponibles
          </h1>
          <p className="text-sm text-zinc-600">
            Explora nuestro catálogo de fragancias. Muy pronto podrás completar
            tu compra directamente desde esta página.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Aún no hay perfumes cargados. Vuelve más tarde.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-2">
                  {product.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  )}

                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {product.brand || "Marca"}
                  </p>

                  <h2 className="text-base font-semibold leading-snug">
                    {product.name}
                  </h2>

                  <p className="text-xs text-zinc-600">
                    {product.sizeMl} ml · {formatCurrency(product.price)}
                  </p>

                  {product.notes && (
                    <p className="mt-2 line-clamp-3 text-xs text-zinc-500">
                      Notas: {product.notes}
                    </p>
                  )}

                  <p
                    className={`mt-1 text-xs font-medium ${
                      product.stock > 0
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {product.stock > 0
                      ? `En stock: ${product.stock}`
                      : "Sin stock"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => handleAddToCart(product)}
                  className={`mt-4 h-9 rounded-full text-xs font-medium transition ${
                    product.stock > 0
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0
                    ? "Agregar al carrito"
                    : "Sin stock"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
