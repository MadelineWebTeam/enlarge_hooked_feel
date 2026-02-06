// lib/requireAdmin.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"


export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  // ❌ No logueado
  if (!session || !session.user) {
    redirect("/api/auth/signin")
  }

  // ❌ No es admin
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  // ✅ Es admin → continúa
}

