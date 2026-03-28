"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Error creando cuenta")
      setLoading(false)
      return
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    })
  }

  async function handleLogin() {
    setLoading(true)
    setError(null)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Email o contraseña incorrectos")
      setLoading(false)
      return
    }

    window.location.href = "/"
  }

  const inputClass =
    "w-full rounded-xl border border-[#E4D4B4] bg-white px-4 py-2.5 text-sm text-[#2B2219] placeholder:text-[#8B6A3F] outline-none focus:border-[#D4B063] transition"

  return (
    <div className="w-full max-w-md rounded-3xl bg-[#FDF9F2] p-7 shadow-[0_12px_32px_rgba(58,33,20,0.15)] space-y-5">

      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8B6A3F]">
          Madeline Scent
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[#2B2219]">
          {mode === "login" ? "Bienvenida de vuelta" : "Crea tu cuenta"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-full border border-[#E4D4B4] bg-white p-1">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 text-xs font-medium transition ${
            mode === "login"
              ? "bg-[#D4B063] text-[#2B2219]"
              : "text-[#5B4A36] hover:text-[#2B2219]"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full py-2 text-xs font-medium transition ${
            mode === "register"
              ? "bg-[#D4B063] text-[#2B2219]"
              : "text-[#5B4A36] hover:text-[#2B2219]"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {/* Campos */}
      <div className="space-y-3">
        {mode === "register" && (
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        )}

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {/* Botón principal */}
      {mode === "login" ? (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-full bg-[#D4B063] py-2.5 text-sm font-medium text-[#2B2219] transition hover:bg-[#C89A4A] disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      ) : (
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full rounded-full bg-[#D4B063] py-2.5 text-sm font-medium text-[#2B2219] transition hover:bg-[#C89A4A] disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      )}

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-[#E4D4B4]" />
        <span className="text-xs text-[#8B6A3F]">o continúa con</span>
        <div className="flex-1 border-t border-[#E4D4B4]" />
      </div>

      {/* GitHub */}
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full rounded-full border border-[#E4D4B4] bg-white py-2.5 text-sm font-medium text-[#2B2219] transition hover:bg-[#FDF9F2]"
      >
        Continuar con GitHub
      </button>
    </div>
  )
}
