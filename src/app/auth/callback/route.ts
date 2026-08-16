import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/plan/1'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    // El intercambio falló (link vencido, ya usado, o abierto en un
    // navegador distinto al que lo pidió). Avisamos en vez de mandar
    // a la persona de vuelta al formulario sin explicación.
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    )
  }

  return NextResponse.redirect(`${origin}/login?error=missing_code&next=${encodeURIComponent(next)}`)
}
