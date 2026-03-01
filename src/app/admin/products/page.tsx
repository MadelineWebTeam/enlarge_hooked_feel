import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { requireAdmin } from "@/lib/requireAdmin"
import { deleteProduct } from "@/actions/product-actions"

export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6">
      <Link href=".products/new" className="relative inline-flex items-center">
        Agregar nuevo
      </Link>

      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Nombre</th>
            <th className="text-left py-2">Desde</th>
            <th className="text-left py-2">Stock Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const minPrice =
              product.variants.length > 0
                ? Math.min(
                    ...product.variants.map((v) =>
                      Number(v.price)
                    )
                  )
                : 0

            const totalStock = product.variants.reduce(
              (sum, v) => sum + v.stock,
              0
            )

            return (
              <tr key={product.id} className="border-b">
              
                <td className="py-3">
                  {product.brand} {product.name}
                </td>

                <td>${minPrice.toFixed(2)}</td>

                <td>{totalStock}</td>

                <td className="flex gap-2 py-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                  >
                    Editar
                  </Link>

                  <form
                    action={deleteProduct.bind(null, product.id)}
                  >
                    <button
                      type="submit"
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
