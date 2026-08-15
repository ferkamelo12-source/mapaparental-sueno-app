'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MainProblem } from '@/lib/content'
import { PROBLEM_LABELS } from '@/lib/content'

const PROBLEMS = Object.keys(PROBLEM_LABELS) as MainProblem[]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [birthDate, setBirthDate] = useState('')
  const [mainProblem, setMainProblem] = useState<MainProblem | ''>('')
  const [sleepLocation, setSleepLocation] = useState('')

  function next() {
    setStep((s) => s + 1)
  }

  function finish() {
    // Guardamos las respuestas temporalmente; se crea el registro real
    // en Supabase justo después de que el padre inicie sesión (magic link).
    localStorage.setItem(
      'pending_baby',
      JSON.stringify({ birthDate, mainProblem, sleepLocation })
    )
    router.push('/login?next=/plan/1')
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <p className="text-sm text-stone-500">Paso {step + 1} de 3</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200">
        <div
          className="h-1.5 rounded-full bg-blue-700 transition-all"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">¿Cuándo nació tu bebé?</h2>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-4 w-full rounded-lg border border-stone-300 p-3"
          />
          <button
            disabled={!birthDate}
            onClick={next}
            className="mt-6 w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">¿Cuál es el reto principal ahora?</h2>
          <div className="mt-4 space-y-2">
            {PROBLEMS.map((p) => (
              <button
                key={p}
                onClick={() => setMainProblem(p)}
                className={`w-full rounded-lg border p-3 text-left ${
                  mainProblem === p
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-stone-300'
                }`}
              >
                {PROBLEM_LABELS[p]}
              </button>
            ))}
          </div>
          <button
            disabled={!mainProblem}
            onClick={next}
            className="mt-6 w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">¿Dónde duerme tu bebé?</h2>
          <div className="mt-4 space-y-2">
            {[
              ['cuna_propia_cuarto', 'Cuna, en su propio cuarto'],
              ['cuarto_padres', 'Cuna o moisés, en el cuarto de los padres'],
              ['cama_compartida', 'Colecho / cama compartida'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSleepLocation(value)}
                className={`w-full rounded-lg border p-3 text-left ${
                  sleepLocation === value
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-stone-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            disabled={!sleepLocation}
            onClick={finish}
            className="mt-6 w-full rounded-full bg-blue-700 py-3 font-semibold text-white disabled:opacity-40"
          >
            Ver mi plan personalizado
          </button>
        </div>
      )}
    </main>
  )
}
