import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import AddToCartButton from "@/components/AddToCartButton"

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

  if (!product) {
    notFound()
  }
  const variant = product.variants[0]

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

            {variant && (
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-[#C89A4A]">
                  ${Number(variant.price).toFixed(2)} MXN
                </span>

                {variant.stock > 0 ? (
                  <span className="text-sm text-green-700">
                    En stock · {variant.stock}
                  </span>
                ) : (
                  <span className="text-sm text-red-600">
                    Sin stock
                  </span>
                )}
              </div>
            )}

            {variant && (
              <AddToCartButton
                product={product}
                variant={variant}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
