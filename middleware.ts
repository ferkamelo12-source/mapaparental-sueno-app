import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Excluye /api/stripe-webhook: ese endpoint recibe peticiones
    // servidor-a-servidor de Stripe, sin cookies de usuario, y este
    // middleware alteraba el cuerpo antes de llegar a la verificación de firma.
    '/((?!_next/static|_next/image|favicon.ico|audio/|api/stripe-webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
