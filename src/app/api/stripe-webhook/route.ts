import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Usa la Service Role Key (NO la anon key) porque este webhook escribe en la
// tabla `subscriptions` de cualquier usuario, sin sesión de por medio.
// Sácala de: Supabase Dashboard > Project Settings > API > service_role.
const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Pago único (no suscripción): al completar el checkout, marcamos al
  // usuario como "paid" para siempre. No hay renovación ni cancelación
  // que rastrear, así que solo escuchamos este evento.
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      if (userId && session.payment_status === 'paid') {
        await supabaseAdmin.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.payment_intent as string,
            status: 'paid',
            price_id: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
