'use client'

import { useState } from 'react'

export default function PreciosPage() {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)

  async function checkout(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Continúa tu plan completo</h1>
      <p className="mt-3 text-stone-600">
        3 días de prueba gratis. Cancela cuando quieras.
      </p>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => checkout('yearly')}
          disabled={loading !== null}
          className="w-full rounded-2xl border-2 border-blue-700 bg-blue-50 p-5 text-left"
        >
          <p className="text-sm font-semibold text-blue-700">MÁS POPULAR — Ahorra 58%</p>
          <p className="mt-1 text-2xl font-bold">$49.99/año</p>
          <p className="text-sm text-stone-600">≈ $4.17/mes</p>
        </button>

        <button
          onClick={() => checkout('monthly')}
          disabled={loading !== null}
          className="w-full rounded-2xl border border-stone-300 bg-white p-5 text-left"
        >
          <p className="text-2xl font-bold">$9.99/mes</p>
          <p className="text-sm text-stone-600">Facturación mensual</p>
        </button>
      </div>

      <p className="mt-6 text-xs text-stone-400">
        Incluye: plan completo de 7 días, registro de sueño digital, guía de
        emergencia nocturna y audio narrado. Nuevas regresiones de sueño
        (4, 8-10 y 18 meses) traen contenido nuevo.
      </p>
    </main>
  )
}
