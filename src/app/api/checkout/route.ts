import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { plan } = await req.json()

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

  const priceId =
    plan === 'yearly' ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/plan/2?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/precios`,
  })

  return NextResponse.json({ url: session.url })
}
