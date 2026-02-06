import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { requireAdmin } from "@/lib/requireAdmin"
import { deleteProduct } from "@/actions/product-actions"
import type { Product } from "@prisma/client"


export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1>Productos</h1>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: Product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price.toString()}</td>
              <td>{product.stock}</td>

              <td className="flex gap-2">
              {/* ✏️ EDITAR */}
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
              >
                Editar
              </Link>

              {/* 🗑️ ELIMINAR */}
              <form action={deleteProduct.bind(null, product.id)}>
                <button
                  type="submit"
                  className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </form>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
