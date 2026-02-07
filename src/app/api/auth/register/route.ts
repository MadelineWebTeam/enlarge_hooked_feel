import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: "USER",
    },
  })

  return NextResponse.json({ ok: true })
}
