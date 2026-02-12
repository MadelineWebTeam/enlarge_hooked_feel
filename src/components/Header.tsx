import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import CartButton from "./CartButton"


export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="flex items-center justify-between border-b border-black/8 bg-zinc-50 px-6 py-4 shadow-sm">
      <Link href="/" className="text-sm font-medium tracking-wide text-[#2B2219] hover:text-[#8B6A3F] transition">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300">
            <div className="h-6 w-6 rounded-full border border-zinc-600" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-[0.12em] uppercase text-black">
              Madeline
            </div>
            <div className="text-xs text-zinc-600">
              Un perfume, mil memorias
            </div>
          </div>  
        </div>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* USER INFO */}
        {session?.user ? (
          <div className="hidden sm:flex flex-col text-right leading-tight">
            {session.user.role === "ADMIN" && (
            <Link href="/admin/products" className="text-xs text-blue-600 hover:underline">
              Admin
            </Link>
            )}
            <span className="text-[10px] text-zinc-500">
              Hola,
            </span>
            <span className="text-sm font-medium">
              {session.user.name || session.user.email}
            </span>

            {session.user.role === "ADMIN" && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                Admin
              </span>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="text-sm font-medium text-zinc-700 hover:underline"
          >
            Iniciar sesión
          </Link>
        )}

        {/* CART */}
        <CartButton />

        {/* LOGOUT */}
        {session?.user && (
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-xs text-zinc-500 hover:text-black"
            >
              Salir
            </button>
          </form>
        )}
      </div>
      
    </header>
  )
}
