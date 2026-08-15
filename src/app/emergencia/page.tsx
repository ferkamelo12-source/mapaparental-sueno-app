import { EMERGENCY_GUIDE } from '@/lib/content'

// Modo oscuro fijo: se usa a las 3 AM, con el cerebro apagado.
// Texto grande, alto contraste, sin nada que requiera pensar.
export default function EmergenciaPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-stone-100">
      <p className="text-center text-xs uppercase tracking-widest text-stone-400">
        Guía de emergencia nocturna
      </p>
      <h1 className="mt-2 text-center text-2xl font-bold">
        Para cuando el cerebro no piensa claro
      </h1>

      <section className="mt-8 rounded-2xl bg-stone-900 p-5">
        <p className="text-sm font-semibold text-blue-400">
          ⏰ Antes de actuar ({EMERGENCY_GUIDE.before.duration})
        </p>
        <ul className="mt-3 space-y-2 text-lg">
          {EMERGENCY_GUIDE.before.steps.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl bg-stone-900 p-5">
        <p className="text-sm font-semibold text-blue-400">
          🔍 Verificación rápida ({EMERGENCY_GUIDE.check.duration})
        </p>
        <ul className="mt-3 space-y-2 text-lg">
          {EMERGENCY_GUIDE.check.steps.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl bg-stone-900 p-5">
        <p className="text-sm font-semibold text-blue-400">
          🤲 Intervención mínima ({EMERGENCY_GUIDE.minIntervention.duration})
        </p>
        <p className="mt-3 text-lg">{EMERGENCY_GUIDE.minIntervention.text}</p>
      </section>

      <section className="mt-4 rounded-2xl bg-stone-900 p-5">
        <p className="text-sm font-semibold text-blue-400">Si persiste 10+ min</p>
        <p className="mt-3 text-lg">{EMERGENCY_GUIDE.ifPersists.text}</p>
      </section>

      <section className="mt-4 rounded-2xl bg-red-950 p-5">
        <p className="text-sm font-semibold text-red-300">❌ Nunca hacer</p>
        <ul className="mt-3 space-y-1 text-stone-200">
          {EMERGENCY_GUIDE.never.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-sm italic text-stone-400">
        &ldquo;Tu calma es contagiosa. Respira, tómate tu tiempo, y confía en que
        esta fase pasará. No estás solo en esto.&rdquo;
      </p>
    </main>
  )
}
