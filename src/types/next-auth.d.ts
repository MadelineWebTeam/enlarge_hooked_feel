import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "USER"
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      role: "ADMIN" | "USER"
    }
  }
}
