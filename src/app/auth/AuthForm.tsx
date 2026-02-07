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

    // Auto login después de registrar
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

  return (
    <div className="w-full max-w-md border p-6 rounded space-y-4">
      <div className="flex gap-2">
        <button
          className={`flex-1 p-2 ${
            mode === "login" ? "bg-black text-white" : "border"
          }`}
          onClick={() => setMode("login")}
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 p-2 ${
            mode === "register" ? "bg-black text-white" : "border"
          }`}
          onClick={() => setMode("register")}
        >
          Crear cuenta
        </button>
      </div>

      {mode === "register" && (
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
        />
      )}

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {mode === "login" ? (
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white p-2"
        >
          Iniciar sesión
        </button>
      ) : (
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-black text-white p-2"
        >
          Crear cuenta
        </button>
      )}

      <hr />
      <button 
        onClick={() => signIn("github", { callbackUrl: "/" } )} 
        className="w-full border p-2">
            Continuar con GitHub
        </button>
    </div>
  )
}
