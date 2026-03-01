import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import ProductDetailClient from "@/components/ProductDetailClient"

type Props = {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const productId = Number(params.id)

  if (isNaN(productId)) notFound()

  const dbProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  })

  if (!dbProduct) notFound()

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    description: dbProduct.description,
    notes: dbProduct.notes,
    imageUrl: dbProduct.imageUrl,
    variants: dbProduct.variants.map(v => ({
      id: v.id,
      sizeMl: v.sizeMl,
      price: Number(v.price),
      stock: v.stock,
      sku: v.sku,
    })),
  }

  return (
    <div className="min-h-screen bg-[#E0C89A] px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-[#FDF9F2] p-8 shadow-lg">
        <div className="grid gap-10 md:grid-cols-2">

          {/* Imagen */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">

            {/* Marca + Nombre */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8B6A3F]">
                {product.brand}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Descripción
                </h2>
                <p className="text-sm leading-relaxed text-[#5B4A36]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Notas */}
            {product.notes && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Notas Olfativas
                </h2>
                <p className="text-sm text-[#6E5A45]">
                  {product.notes}
                </p>
              </div>
            )}

            {/* Parte interactiva */}
            <ProductDetailClient product={product} />

          </div>
        </div>
      </div>
    </div>
  )
}
