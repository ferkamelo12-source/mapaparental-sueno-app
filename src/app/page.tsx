import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Mapa Parental
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          El Método de las 3 Claves
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          De las noches en vela al descanso real. Un plan de 7 días, guiado paso a
          paso, para bebés de 0 a 24 meses. Sin lágrimas. Sin culpa. Con
          resultados.
        </p>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm">
          <p className="text-sm text-stone-500">Hola, soy Fernando Camelo.</p>
          <p className="mt-2 text-stone-700">
            &ldquo;Como padre primerizo que, como tú, pasó de la teoría a la
            realidad de la crianza nocturna, construí esta guía combinando
            investigación científica con lo que aprendí en las trincheras de
            las madrugadas. No estás solo en esto, y no es tu culpa.&rdquo;
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="font-semibold">Clave 1</p>
            <p className="text-sm text-stone-600">El Ambiente Ideal</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="font-semibold">Clave 2</p>
            <p className="text-sm text-stone-600">La Rutina Predictiva</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="font-semibold">Clave 3</p>
            <p className="text-sm text-stone-600">La Respuesta Consistente</p>
          </div>
        </div>

        <Link
          href="/quiz"
          className="mt-10 inline-block rounded-full bg-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-800"
        >
          Empezar mi plan gratis (60 segundos)
        </Link>
        <p className="mt-3 text-xs text-stone-400">
          El Día 1 es gratis. Sin tarjeta para empezar.
        </p>
      </section>
    </main>
  )
}
