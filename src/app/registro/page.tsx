'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

const MOODS = [
  ['bueno', '😊 Bueno'],
  ['regular', '😐 Regular'],
  ['dificil', '😞 Difícil'],
]

function WakingsChart({ logs }: { logs: any[] }) {
  // logs llega ordenado del más reciente al más viejo; lo invertimos para
  // mostrar el tiempo de izquierda (más viejo) a derecha (hoy).
  const data = [...logs].reverse()
  const max = Math.max(1, ...data.map((l) => l.night_wakings ?? 0))
  const barWidth = 28
  const gap = 10
  const chartHeight = 90
  const width = data.length * barWidth + (data.length - 1) * gap

  return (
    <svg
      viewBox={`0 0 ${width} ${chartHeight + 24}`}
      width="100%"
      height={chartHeight + 24}
      role="img"
      aria-label="Despertares nocturnos por noche, de más viejo a más reciente"
    >
      {data.map((l, i) => {
        const value = l.night_wakings ?? 0
        const barHeight = Math.max(4, (value / max) * chartHeight)
        const x = i * (barWidth + gap)
        const y = chartHeight - barHeight
        const isLast = i === data.length - 1
        return (
          <g key={l.id}>
            <title>{`${l.log_date}: ${value} despertares`}</title>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={isLast ? '#1d4ed8' : '#93c5fd'}
            />
            {isLast && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#1d4ed8"
              >
                {value}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={chartHeight + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#78716c"
            >
              {l.log_date.slice(5).replace('-', '/')}
            </text>
          </g>
        )
      })}
      <line
        x1={0}
        y1={chartHeight}
        x2={width}
        y2={chartHeight}
        stroke="#e7e5e4"
        strokeWidth={1}
      />
    </svg>
  )
}

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
      <Link href="/plan/1" className="text-sm font-medium text-stone-500">
        ← Volver a mi plan
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Registro de sueño de hoy</h1>
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
          <div className="rounded-xl bg-blue-50 p-4 text-sm">
            <p className="font-semibold text-blue-900">Tu progreso</p>
            <p className="mt-1 text-stone-700">
              Llevas <span className="font-semibold">{logs.length}</span>{' '}
              {logs.length === 1 ? 'día registrado' : 'días registrados'} · promedio de{' '}
              <span className="font-semibold">
                {(logs.reduce((sum, l) => sum + (l.night_wakings ?? 0), 0) / logs.length).toFixed(1)}
              </span>{' '}
              despertares por noche.
            </p>

            <div className="mt-3 overflow-x-auto">
              <WakingsChart logs={logs} />
            </div>

            {logs.length >= 2 &&
              (() => {
                const masReciente = logs[0].night_wakings ?? 0
                const masViejo = logs[logs.length - 1].night_wakings ?? 0
                const diff = masViejo - masReciente
                if (diff > 0) {
                  return (
                    <p className="mt-2 font-medium text-green-700">
                      📈 Vas mejorando: {diff} despertar{diff === 1 ? '' : 'es'} menos que al
                      principio de tu registro.
                    </p>
                  )
                }
                if (diff < 0) {
                  return (
                    <p className="mt-2 text-stone-600">
                      Vas con {Math.abs(diff)} despertar{Math.abs(diff) === 1 ? '' : 'es'} más que
                      al principio — es normal tener altibajos, sigue con la rutina consistente.
                    </p>
                  )
                }
                return (
                  <p className="mt-2 text-stone-600">
                    Va estable comparado con tu primer registro — sigue así unos días más para ver
                    el patrón completo.
                  </p>
                )
              })()}
          </div>

          <h2 className="mt-6 font-semibold">Últimos días</h2>
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
