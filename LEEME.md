# El Método de las 3 Claves — Miniapp

App funcional (Next.js 16 + Supabase + Stripe) construida a partir de tus 4
PDF de Mapa Parental. El build de producción ya está probado y compila sin
errores.

## Ya está hecho
- Landing con tu copy de autor.
- Quiz de 3 pasos (edad, problema principal, dónde duerme) → genera el plan.
- Plan de 7 días, con la Sección 2 y 3 de tu guía convertida en tareas diarias
  concretas, ventanas de sueño por edad calculadas automáticamente, y los
  mitos del PDF.
- Registro de sueño digital (tu "Registro de 7 Días" pero como formulario).
- Guía de emergencia nocturna en modo oscuro, con botón fijo visible en toda
  la app.
- Login sin contraseña (magic link por email) vía Supabase Auth.
- Base de datos ya creada en un proyecto Supabase nuevo y separado
  ("mapaparental-sueno"), con seguridad a nivel de fila (cada usuario solo ve
  sus propios datos).
- Página de precios ($9.99/mes o $49.99/año, prueba de 3 días) y las rutas de
  Stripe Checkout + webhook para activar/cancelar la suscripción automáticamente.

## Lo que TÚ necesitas hacer antes de lanzar (15-20 min)

1. **Crea tu cuenta de Stripe** (stripe.com) si no la tienes.
2. En el panel de Stripe (modo Test primero):
   - Crea dos precios recurrentes: uno mensual ($9.99) y uno anual ($49.99).
   - Copia sus `price_id` a `STRIPE_PRICE_MONTHLY` y `STRIPE_PRICE_YEARLY` en `.env.local`.
   - Copia tu clave secreta a `STRIPE_SECRET_KEY` y la pública a `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. En Supabase Dashboard → proyecto **mapaparental-sueno** → Project Settings →
   API → copia la `service_role key` a `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`.
4. **Sube el audio:** corta el MP3 de 2 horas en pistas cortas (una por
   sección: Introducción, Clave 1, Clave 2, Clave 3, Plan de 7 días...) y
   súbelas a Supabase Storage. Te puedo ayudar a trocearlo si quieres.

## Cómo desplegarlo (tú conectas tu cuenta de Vercel)

1. Sube esta carpeta a un repositorio de GitHub (crea uno nuevo, ej. `mapaparental-sueno-app`).
2. En vercel.com → "Add New Project" → importa ese repo.
3. En la configuración del proyecto en Vercel, pega TODAS las variables de
   `.env.local` (con tus valores reales de Stripe/Supabase) en
   "Environment Variables".
4. Deploy. Vercel te da la URL de producción en ~1 minuto.
5. En Stripe → Developers → Webhooks: crea un webhook apuntando a
   `https://tu-dominio.vercel.app/api/stripe-webhook`, escuchando
   `checkout.session.completed`, `customer.subscription.updated` y
   `customer.subscription.deleted`. Copia el `whsec_...` a
   `STRIPE_WEBHOOK_SECRET` en Vercel y vuelve a desplegar.
6. Conecta tu dominio propio en Vercel → Settings → Domains (opcional, día 5
   del plan).

## Desarrollo local

```bash
npm install
npm run dev
```

## Próximos pasos técnicos sugeridos (no bloquean el lanzamiento)
- Reemplazar el placeholder de audio por el reproductor real una vez subas
  las pistas a Supabase Storage.
- Configurar Supabase Auth → Email templates con tu tono de marca.
- Cuando quieras cambiar de modo Test a modo Live en Stripe, repite el paso 2
  con tus claves `live`.
