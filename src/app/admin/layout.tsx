import { ReactNode } from "react"
import { requireAdmin } from "@/lib/requireAdmin"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireAdmin()

  return (
    <div>
      <nav>
        <h2>Admin Panel</h2>
      </nav>

      <main>{children}</main>
    </div>
  )
}
