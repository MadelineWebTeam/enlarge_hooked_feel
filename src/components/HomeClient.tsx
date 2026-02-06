"use client"

import { useCartStore } from "@/store/cartStore"
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


  return (
    <div className="min-h-screen bg-[#E0C89A] font-sans text-[#2B2219]">

      {/* CONTENIDO PRINCIPAL */}
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
        {/* 1) SECCIÓN CARRUSEL / NOVEDADES (placeholder) */}
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
                Aquí podrás mostrar un carrusel con los lanzamientos más
                recientes, colecciones especiales o promociones. Por ahora es
                solo un espacio de diseño listo para conectar imágenes reales.
              </p>
            </div>

            {/* Placeholder visual del carrusel */}
            <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-[#E4D4B4] bg-linear-to-br from-[#EBD4AE] via-[#FDF9F2] to-[#E0C89A] text-xs text-[#7B6341] sm:h-44 sm:w-80">
              Área de carrusel / imágenes de perfumes
            </div>
          </div>
        </section>

        {/* 2) SECCIÓN SOBRE NOSOTROS */}
        <section className="grid gap-6 rounded-3xl bg-[#FDF9F2] p-5 shadow-[0_12px_32px_rgba(58,33,20,0.12)] sm:grid-cols-[1.4fr_1fr] sm:p-7">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">
              Sobre Madeline
            </h2>
            <p className="text-sm leading-relaxed text-[#5B4A36]">
              Madeline nace de la idea de que cada fragancia es una memoria
              líquida. Seleccionamos perfumes que no solo huelen bien, sino que
              acompañan momentos importantes de la vida: encuentros, despedidas,
              comienzos y celebraciones.
            </p>
            <p className="text-sm leading-relaxed text-[#5B4A36]">
              Estamos construyendo este espacio para que puedas descubrir
              fragancias nuevas, comparar notas olfativas y encontrar el aroma
              que mejor cuente tu historia. Nuestro objetivo es hacer que la
              experiencia de elegir un perfume en línea sea cálida, clara y
              cercana.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#E4D4B4] bg-white p-4 text-sm text-[#5B4A36]">
            <h3 className="text-sm font-semibold">Atención personalizada</h3>
            <p className="text-xs leading-relaxed">
              Muy pronto podrás completar tu compra directamente desde la web.
              Mientras tanto, si tienes dudas sobre alguna fragancia, notas o
              recomendaciones, podremos guiarte para que elijas el perfume
              ideal.
            </p>
            <button className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-[#D4B063] px-4 text-xs font-medium text-[#2B2219] transition hover:bg-[#C89A4A]">
              Contactar asesor
            </button>
          </div>
        </section>

        
        
        {/* CATÁLOGO */}
        <section className="rounded-3xl bg-[#FDF9F2] p-5 shadow sm:p-7">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">
              Nuestro catálogo de perfumes
            </h2>
            <span className="text-xs text-zinc-500">
              {products.length} perfumes
            </span>
          </div>

          <div className="mt-4 divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 gap-3 px-4 py-3 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]"
              >
                <div>
                  <p className="text-xs uppercase text-zinc-500">
                    {product.brand}
                  </p>
                  <p className="font-semibold">{product.name}</p>
                  {product.notes && (
                    <p className="text-xs text-zinc-500">
                      Notas: {product.notes}
                    </p>
                  )}
                </div>

                <div>{product.sizeMl} ml</div>

                <div className="font-semibold text-[#C89A4A]">
                  {formatCurrency(Number(product.price))}
                </div>

                <div>
                  {product.stock > 0 ? (
                    <span className="text-green-700">
                      En stock · {product.stock}
                    </span>
                  ) : (
                    <span className="text-red-600">Sin stock</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="border px-3 py-1 rounded-full">
                    Ver detalle
                  </button>

                  <button
                    disabled={product.stock <= 0}
                    onClick={() => handleAddToCart(product)}
                    className="bg-[#D4B063] px-3 py-1 rounded-full disabled:opacity-50"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
