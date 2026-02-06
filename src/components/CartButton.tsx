"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"

export default function CartButton() {
  const totalItems = useCartStore(state => state.getTotalItems())

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🚫 Evita hydration mismatch
  if (!mounted) {
    return (
      <Link href="/cart" className="relative inline-flex items-center">
        🛒
      </Link>
    )
  }

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs text-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
