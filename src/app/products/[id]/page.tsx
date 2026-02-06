import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"

type Props = {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const productId = Number(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#E0C89A] px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#FDF9F2] p-6 shadow">

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* IMAGEN */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                {product.brand}
              </p>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
            </div>

            {product.notes && (
              <p className="text-sm text-zinc-600">
                Notas: {product.notes}
              </p>
            )}

            {product.description && (
              <p className="text-sm text-zinc-600">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#C89A4A]">
                ${Number(product.price).toFixed(2)} MXN
              </span>

              {product.stock > 0 ? (
                <span className="text-sm text-green-700">
                  En stock · {product.stock}
                </span>
              ) : (
                <span className="text-sm text-red-600">
                  Sin stock
                </span>
              )}
            </div>

            {/* CTA */}
            <button
              disabled={product.stock <= 0}
              className="w-full rounded-full bg-[#D4B063] px-4 py-2 font-medium disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
