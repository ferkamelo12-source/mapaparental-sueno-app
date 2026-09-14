'use client'

import { useState } from 'react'

export default function PreciosPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      if (res.status === 401) {
        setError('Tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo.')
      } else {
        setError(data.error || 'No se pudo iniciar el pago. Intenta de nuevo.')
      }
    } catch {
      setError('No se pudo conectar. Revisa tu internet e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Continúa tu plan completo</h1>
      <p className="mt-3 text-stone-600">
        El Día 1 ya lo probaste gratis. Un solo pago, acceso de por vida —
        sin suscripciones ni renovaciones.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      <div className="mt-8">
        <button
          onClick={checkout}
          disabled={loading}
          className="w-full rounded-2xl border-2 border-blue-700 bg-blue-50 p-5 text-left disabled:opacity-60"
        >
          <p className="text-sm font-semibold text-blue-700">PAGO ÚNICO — Acceso de por vida</p>
          <p className="mt-1 text-2xl font-bold">$17 USD</p>
          <p className="text-sm text-stone-600">Sin mensualidades, sin cancelar nada</p>
          {loading && <p className="mt-1 text-xs text-blue-700">Conectando con Stripe…</p>}
        </button>
      </div>

      <div className="mt-8 rounded-xl bg-stone-50 p-5 text-left">
        <p className="text-sm font-semibold text-stone-700">Todo lo que incluye tu plan:</p>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          <li>✅ Plan guiado de 7 días, con audio narrado completo</li>
          <li>✅ Registro de sueño digital</li>
          <li>✅ Guía de Emergencia Nocturna, siempre a un toque</li>
          <li>✅ Nuevas regresiones de sueño (4, 8-10 y 18 meses)</li>
          <li>🎁 <span className="font-medium text-stone-800">BONO:</span> Rutina Diaria para tu Bebé (PDF)</li>
          <li>🎁 <span className="font-medium text-stone-800">BONO:</span> Proceso Manual Completo (PDF)</li>
        </ul>
      </div>
    </main>
  )
}
