"use client"

import Image from "next/image"
import { useCartStore } from "@/store/cartStore"
import HomeCarousel from "@/components/HomeCarousel"
import type { ProductDTO } from "@/types/product"

type Props = {
  products: ProductDTO[]
}




const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value)

export default function HomeClient({ products }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: ProductDTO) => {
    addItem(product)
  }

  const featured = products.slice(0, 5).map((p) => ({
    id: p.id,
    imageUrl: p.imageUrl || "/placeholder.jpg",
    title: p.name,
  }))

  return (
    <div className="min-h-screen bg-[#E0C89A] font-sans text-[#2B2219]">
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">

        {/* NOVEDADES */}
        <section className="rounded-3xl bg-[#FDF9F2] p-5 shadow-[0_12px_32px_rgba(58,33,20,0.15)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 sm:max-w-md">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8B6A3F]">
                Novedades
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Descubre las fragancias destacadas de Madeline
              </h1>
              <p className="text-sm leading-relaxed text-[#5B4A36]">
                Descubre nuestras fragancias más recientes y colecciones especiales.
              </p>
            </div>

            <div className="w-full sm:w-80">
               <HomeCarousel items={featured} />
            </div>
          </div>
        </section>

        {/* SOBRE NOSOTROS */}
        <section className="grid gap-6 rounded-3xl bg-[#FDF9F2] p-5 shadow-[0_12px_32px_rgba(58,33,20,0.12)] sm:grid-cols-[1.4fr_1fr] sm:p-7">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Sobre Madeline
            </h2>
            <p className="text-sm leading-relaxed text-[#5B4A36]">
              Cada fragancia es una memoria líquida. Te ayudamos a encontrar el aroma que cuente tu historia.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#E4D4B4] bg-white p-4 text-sm text-[#5B4A36]">
            <h3 className="text-sm font-semibold">Atención personalizada</h3>
            <p className="text-xs leading-relaxed">
              Muy pronto podrás comprar directamente desde la web.
            </p>
            <button className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-[#D4B063] px-4 text-xs font-medium text-[#2B2219] transition hover:bg-[#C89A4A]">
              Contactar asesor
            </button>
          </div>
        </section>

        {/* CATÁLOGO EN HOME */}
        <section className="space-y-6">
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
                      {product.sizeMl} ml · {formatCurrency(Number(product.price))}
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
        </section>
      </main>
    </div>
  )
}
