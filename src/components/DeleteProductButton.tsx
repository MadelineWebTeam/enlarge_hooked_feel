"use client"

export function DeleteProductButton() {
  return (
    <button
      type="submit"
      className="text-red-600"
      onClick={(e) => {
        if (!confirm("¿Eliminar producto?")) {
          e.preventDefault()
        }
      }}
    >
      Eliminar
    </button>
  )
}
