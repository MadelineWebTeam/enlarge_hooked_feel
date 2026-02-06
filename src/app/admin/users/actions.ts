"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { requireAdmin } from "@/lib/requireAdmin"

export async function createUser(formData: FormData) {
  await requireAdmin() // 🔐 solo admin

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "Datos incompletos" }
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  })

  if (exists) {
    return { error: "Email ya registrado" }
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "USER", // 🔒 forzado
    },
  })

  return { success: true }
}
