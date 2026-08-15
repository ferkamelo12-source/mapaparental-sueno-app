'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

function LoginForm() {
  const params = useSearchParams()
  const next = params.get('next') ?? '/plan/1'
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    })
    setLoading(false)
    if (!error) setSent(true)
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-xl bg-blue-50 p-6 text-center">
        <p className="font-semibold">Revisa tu correo ✉️</p>
        <p className="mt-2 text-sm text-stone-600">
          Te enviamos un enlace mágico a {email}. Ábrelo para entrar y guardar
          tu plan.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <p className="text-stone-600">
        Tu plan ya está listo. Déjanos tu correo para guardarlo y no perderlo.
      </p>
      <input
        type="email"
        required
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-stone-300 p-3"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
      >
        {loading ? 'Enviando…' : 'Enviarme el acceso'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold">Guarda tu plan</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
