'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import {
  DAY_PLAN,
  ageInMonths,
  getSleepWindowForAge,
  MYTHS,
  MEDICAL_DISCLAIMER,
} from '@/lib/content'

type Baby = {
  id: string
  birth_date: string
  main_problem: string
}

export default function PlanDayPage() {
  const params = useParams()
  const router = useRouter()
  const day = Number(params.day)
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [baby, setBaby] = useState<Baby | null>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([])
  const [mythsRead, setMythsRead] = useState(false)

  const bootstrap = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/quiz')
      return
    }

    // Si venimos del quiz, crea el registro del bebé con las respuestas guardadas
    const pending = localStorage.getItem('pending_baby')
    let { data: babies } = await supabase
      .from('babies')
      .select('id, birth_date, main_problem')
      .eq('user_id', user.id)
      .limit(1)

    if ((!babies || babies.length === 0) && pending) {
      const parsed = JSON.parse(pending)
      const { data: created } = await supabase
        .from('babies')
        .insert({
          user_id: user.id,
          birth_date: parsed.birthDate,
          main_problem: parsed.mainProblem,
          sleep_location: parsed.sleepLocation,
        })
        .select('id, birth_date, main_problem')
        .limit(1)
      babies = created
      localStorage.removeItem('pending_baby')
    }

    if (babies && babies.length > 0) {
      setBaby(babies[0])
    }

    // Consultamos la suscripción siempre (no solo del día 2 en adelante),
    // porque también la usamos para decidir si se desbloquea el audio
    // completo en vez del adelanto, sin importar en qué día esté la persona.
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()
    const paid = !!sub && sub.status === 'active'
    setIsPaidUser(paid)

    // Día 1 siempre gratis. Del día 2 en adelante requiere suscripción activa/en prueba.
    if (day <= 1) {
      setHasAccess(true)
    } else {
      setHasAccess(paid)
    }

    setLoading(false)
  }, [day, router, supabase])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  async function markComplete() {
    if (!baby) return
    await supabase.from('day_progress').upsert(
      {
        baby_id: baby.id,
        day_number: day,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'baby_id,day_number' }
    )
    if (day < 7) router.push(`/plan/${day + 1}`)
  }

  if (loading) return <main className="p-8 text-center text-stone-500">Cargando tu plan…</main>

  const content = DAY_PLAN[day]
  if (!content) return <main className="p-8 text-center">Día no válido.</main>

  const tasksAllChecked =
    content.tasks.length > 0 && checkedTasks.filter(Boolean).length === content.tasks.length
  const canComplete = audioPlayed && tasksAllChecked && (day !== 1 || mythsRead)

  if (!hasAccess) {
    return (
      <main className="mx-auto min-h-screen max-w-md px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">El Día 1 fue gratis 🎉</h1>
        <p className="mt-3 text-stone-600">
          Para continuar con el plan completo de 7 días (incluyendo la Clave 1,
          tu registro de sueño y la guía de emergencia nocturna) activa tu
          plan.
        </p>
        <a
          href="/precios"
          className="mt-6 inline-block rounded-full bg-blue-700 px-8 py-3 font-semibold text-white"
        >
          Continuar mi plan
        </a>
      </main>
    )
  }

  const ageMonths = baby ? ageInMonths(baby.birth_date) : null
  const window = ageMonths !== null ? getSleepWindowForAge(ageMonths) : null

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">{content.clave}</p>
      <h1 className="mt-1 text-3xl font-bold">{content.title}</h1>

      {window && (
        <div className="mt-6 rounded-xl bg-stone-100 p-4 text-sm">
          <p className="font-semibold">Tu bebé ({ageMonths} meses) necesita aproximadamente:</p>
          <p className="mt-1 text-stone-600">
            {window.total} de sueño total · vigilia de {window.vigilia} · {window.siestas}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm text-stone-500">🎧 Audio de hoy</p>
        <p className="font-medium">{content.audioTrack}</p>
        {isPaidUser ? (
          <audio
            key={`dia-${day}`}
            controls
            className="mt-3 w-full"
            preload="none"
            onPlay={() => setAudioPlayed(true)}
          >
            <source src={`/audio/dia-${day}.mp3`} type="audio/mpeg" />
          </audio>
        ) : (
          <>
            <audio
              controls
              className="mt-3 w-full"
              preload="none"
              onPlay={() => setAudioPlayed(true)}
            >
              <source src="/audio/preview-gratis.mp3" type="audio/mpeg" />
            </audio>
            <p className="mt-2 text-xs text-stone-400">
              Este es un adelanto de 90 segundos. Al activar tu plan, se
              desbloquea el audio completo de cada día.
            </p>
          </>
        )}
        {!audioPlayed && (
          <p className="mt-2 text-xs text-amber-600">
            Dale play al audio para poder completar el día de hoy.
          </p>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {content.tasks.map((task, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700"
                checked={!!checkedTasks[i]}
                onChange={(e) => {
                  const next = [...checkedTasks]
                  next[i] = e.target.checked
                  setCheckedTasks(next)
                }}
              />
              <span>{task}</span>
            </label>
          </li>
        ))}
      </ul>
      {!tasksAllChecked && (
        <p className="mt-2 text-xs text-amber-600">
          Marca cada tarea a medida que la hagas para poder completar el día.
        </p>
      )}

      {day === 1 && (
        <div className="mt-8">
          <h2 className="font-semibold">Mitos que probablemente creías</h2>
          <div className="mt-3 space-y-3">
            {MYTHS.map((m) => (
              <div key={m.title} className="rounded-xl bg-amber-50 p-4 text-sm">
                <p className="font-medium">{m.title}</p>
                <p className="mt-1 text-stone-600">{m.reality}</p>
              </div>
            ))}
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-700"
              checked={mythsRead}
              onChange={(e) => setMythsRead(e.target.checked)}
            />
            Ya leí los {MYTHS.length} mitos
          </label>
        </div>
      )}

      <Link
        href="/registro"
        className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium text-stone-700"
      >
        📋 Ir a mi registro de sueño
      </Link>

      {isPaidUser && (
        <Link
          href="/bonos"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium text-stone-700"
        >
          🎁 Ver mis bonos
        </Link>
      )}

      <button
        onClick={markComplete}
        disabled={!canComplete}
        className="mt-4 w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
      >
        {day < 7 ? 'Completar día y continuar →' : 'Completar mi semana 🎉'}
      </button>

      <p className="mt-6 text-center text-xs text-stone-400">{MEDICAL_DISCLAIMER}</p>
    </main>
  )
}
