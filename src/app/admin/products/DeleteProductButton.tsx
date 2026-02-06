"use client"

export function DeleteProductButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("¿Eliminar producto?")) {
          e.preventDefault()
        }
      }}
      className="text-red-600"
    >
      Eliminar
    </button>
  )
}
