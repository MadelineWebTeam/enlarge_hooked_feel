import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    )
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      role: "USER",
    },
  })

  return NextResponse.json({ ok: true })
}
