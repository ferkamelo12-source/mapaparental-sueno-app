'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'

const MOODS = [
  ['bueno', '😊 Bueno'],
  ['regular', '😐 Regular'],
  ['dificil', '😞 Difícil'],
]

export default function RegistroPage() {
  const supabase = createClient()
  const [babyId, setBabyId] = useState<string | null>(null)
  const [bedtime, setBedtime] = useState('')
  const [wakings, setWakings] = useState(0)
  const [wakeTime, setWakeTime] = useState('')
  const [mood, setMood] = useState('')
  const [saved, setSaved] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { data: babies } = await supabase
      .from('babies')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
    if (babies && babies[0]) {
      setBabyId(babies[0].id)
      const { data: recentLogs } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('baby_id', babies[0].id)
        .order('log_date', { ascending: false })
        .limit(7)
      setLogs(recentLogs ?? [])
    }
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    if (!babyId) return
    await supabase.from('sleep_logs').upsert(
      {
        baby_id: babyId,
        log_date: new Date().toISOString().slice(0, 10),
        bedtime: bedtime || null,
        night_wakings: wakings,
        wake_time: wakeTime || null,
        morning_mood: mood || null,
      },
      { onConflict: 'baby_id,log_date' }
    )
    setSaved(true)
    load()
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold">Registro de sueño de hoy</h1>
      <p className="mt-2 text-sm text-stone-600">
        30 segundos cada mañana. Observa patrones, no te obsesiones.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Hora de dormir</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 p-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Despertares nocturnos</span>
          <input
            type="number"
            min={0}
            value={wakings}
            onChange={(e) => setWakings(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-stone-300 p-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Hora de despertar</span>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 p-3"
          />
        </label>

        <div>
          <span className="text-sm font-medium">Humor matutino</span>
          <div className="mt-1 flex gap-2">
            {MOODS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMood(value)}
                className={`flex-1 rounded-lg border p-3 text-sm ${
                  mood === value ? 'border-blue-700 bg-blue-50' : 'border-stone-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          className="w-full rounded-full bg-blue-700 py-3 font-semibold text-white"
        >
          {saved ? 'Guardado ✓ — Actualizar' : 'Guardar registro de hoy'}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold">Últimos días</h2>
          <div className="mt-3 space-y-2 text-sm">
            {logs.map((l) => (
              <div key={l.id} className="flex justify-between rounded-lg bg-stone-100 p-3">
                <span>{l.log_date}</span>
                <span>{l.night_wakings} despertares</span>
                <span>{l.morning_mood ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
