 "use client"

import { useState } from "react"
import { createUser } from "../actions"

export default function NewUserPage() {
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    const res = await createUser(formData)

    if (res?.error) setError(res.error)
    else alert("Usuario creado")
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold mb-4">Nuevo usuario</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Nombre"
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="input"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="btn-primary w-full">
          Crear usuario
        </button>
      </form>
    </div>
  )
}
