import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('TU_CLAVE')) {
    return NextResponse.json(
      { error: 'Falta configurar STRIPE_SECRET_KEY en .env.local' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 1700,
            product_data: {
              name: 'El Método de las 3 Claves — Acceso completo',
              description:
                'Plan guiado de 7 días, audio narrado, registro de sueño y bonos. Pago único, acceso de por vida.',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/plan/2?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/precios`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: 'No se pudo iniciar el pago con Stripe. Intenta de nuevo en unos minutos.' },
      { status: 502 }
    )
  }
}
