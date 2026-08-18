'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function BonosPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/quiz')
        return
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle()

      setHasAccess(!!sub && ['trialing', 'active'].includes(sub.status))
      setLoading(false)
    })()
  }, [router, supabase])

  if (loading) return <main className="p-8 text-center text-stone-500">Cargando…</main>

  if (!hasAccess) {
    return (
      <main className="mx-auto min-h-screen max-w-md px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Tus bonos están casi listos 🎁</h1>
        <p className="mt-3 text-stone-600">
          Activa tu plan para desbloquear los dos bonos de regalo: la Rutina
          Diaria y el Proceso Manual Completo, en PDF para imprimir o guardar.
        </p>
        <a
          href="/precios"
          className="mt-6 inline-block rounded-full bg-blue-700 px-8 py-3 font-semibold text-white"
        >
          Activar mi plan
        </a>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold">Tus bonos 🎁</h1>
      <p className="mt-2 text-stone-600">
        Dos regalos incluidos en tu plan, listos para descargar o imprimir.
      </p>

      <div className="mt-8 space-y-4">
        <a
          href="/bonos/rutina-diaria.pdf"
          download
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5"
        >
          <div>
            <p className="font-semibold">Rutina Diaria para tu Bebé</p>
            <p className="mt-1 text-sm text-stone-500">PDF · para imprimir</p>
          </div>
          <span className="text-blue-700">↓</span>
        </a>

        <a
          href="/bonos/proceso-manual-completo.pdf"
          download
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-5"
        >
          <div>
            <p className="font-semibold">Proceso Manual Completo</p>
            <p className="mt-1 text-sm text-stone-500">
              PDF · la guía completa escrita, todo lo que se narra en el audio
            </p>
          </div>
          <span className="text-blue-700">↓</span>
        </a>
      </div>

      <Link
        href="/plan/1"
        className="mt-8 block text-center text-sm font-medium text-stone-500"
      >
        ← Volver a mi plan
      </Link>
    </main>
  )
}
