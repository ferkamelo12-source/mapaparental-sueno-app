// Contenido basado en "El Método de las 3 Claves" - Mapa Parental / Fernando Camelo

export type MainProblem =
  | 'no_duerme_solo'
  | 'despertares_frecuentes'
  | 'siestas_cortas'
  | 'resistencia_dormir'

export const PROBLEM_LABELS: Record<MainProblem, string> = {
  no_duerme_solo: 'No se duerme solo(a)',
  despertares_frecuentes: 'Se despierta muy seguido en la noche',
  siestas_cortas: 'Las siestas son muy cortas',
  resistencia_dormir: 'Se resiste a la hora de dormir',
}

// Ventanas de sueño óptimas por edad (Sección 1 de la guía, pág. 4)
export const SLEEP_WINDOWS = [
  { minMonths: 0, maxMonths: 3, total: '14-17 horas', vigilia: '45-90 minutos', siestas: '4-6 por día' },
  { minMonths: 4, maxMonths: 6, total: '12-16 horas', vigilia: '1.5-2.5 horas', siestas: '3-4 por día' },
  { minMonths: 7, maxMonths: 12, total: '12-15 horas', vigilia: '2.5-4 horas', siestas: '2-3 por día' },
  { minMonths: 13, maxMonths: 24, total: '11-14 horas', vigilia: '4-6 horas', siestas: '1-2 por día' },
]

export function getSleepWindowForAge(ageMonths: number) {
  return (
    SLEEP_WINDOWS.find((w) => ageMonths >= w.minMonths && ageMonths <= w.maxMonths) ??
    SLEEP_WINDOWS[SLEEP_WINDOWS.length - 1]
  )
}

export function ageInMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  return (
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  )
}

// Los 5 mitos (pág. 6-7)
export const MYTHS = [
  {
    title: '"Los bebés deberían dormir toda la noche a los 3 meses"',
    reality:
      'Solo ~60% de los bebés de 6 meses duermen un período ininterrumpido de 6 horas. Los despertares nocturnos son normales bien entrado el primer año.',
  },
  {
    title: '"Mantenerlos despiertos más tiempo hará que duerman mejor"',
    reality:
      'Es el mito más contraproducente. Mantener a un niño despierto más allá de su ventana óptima produce cortisol, que hace más difícil dormirse y mantener el sueño.',
  },
  {
    title: '"Debes eliminar todas las tomas nocturnas a los 6 meses"',
    reality:
      'Algunos bebés genuinamente necesitan calorías nocturnas más allá de los 6 meses. La alimentación nocturna también da consuelo y conexión, no solo calorías.',
  },
  {
    title: '"Dejar llorar es el único método que funciona" / "Dejar llorar es dañino"',
    reality:
      'La verdad está en el medio. Lo más importante es la consistencia y el enfoque que elijas, no el método específico. No hay una respuesta "correcta" universal.',
  },
  {
    title: '"Si creas malos hábitos ahora, durarán para siempre"',
    reality:
      'Los bebés son increíblemente adaptables. Lo que necesitan a los 3 meses es diferente a los 9 y a los 18. Puedes hacer cambios cuando sea el momento adecuado.',
  },
]

// Plan de 7 días - mapea las 3 Claves del método a tareas diarias concretas
export const DAY_PLAN: Record<
  number,
  { title: string; clave: string; tasks: string[]; audioTrack: string }
> = {
  1: {
    title: 'Día 1 · Entiende qué está pasando (y suelta la culpa)',
    clave: 'Fundamentos',
    tasks: [
      'Lee "No es tu culpa": el sueño infantil problemático afecta a 20-40% de los bebés.',
      'Identifica en qué ventana de sueño está tu bebé según su edad (te lo calculamos abajo).',
      'Revisa los 5 mitos más comunes y marca cuáles creías ciertos.',
    ],
    audioTrack: 'Introducción y La Ciencia Simple del Sueño Infantil',
  },
  2: {
    title: 'Día 2 · Clave 1 — El Ambiente Ideal',
    clave: 'Clave 1: Ambiente',
    tasks: [
      'Oscurece la habitación: apunta a que no puedas ver tu mano frente a tu cara.',
      'Revisa la temperatura: ideal entre 18-21°C (65-70°F).',
      'Añade ruido blanco a volumen bajo y constante, a 2-3 metros de la cuna.',
      'Verifica la cuna: firme, plana y sin nada suelto (Regla de Oro de seguridad).',
    ],
    audioTrack: 'Clave 1: El Ambiente Ideal',
  },
  3: {
    title: 'Día 3 · Clave 2 — La Rutina Predictiva',
    clave: 'Clave 2: Rutina',
    tasks: [
      'Define tu secuencia de 3-4 pasos antes de dormir (ej: baño, toma, cuento, cuna).',
      'Repite la misma secuencia, en el mismo orden, a la misma hora aproximada.',
      'Empieza la rutina en cuanto veas señales de sueño (bostezos, frotarse los ojos), no cuando esté "muy cansado".',
    ],
    audioTrack: 'Clave 2: La Rutina Predictiva',
  },
  4: {
    title: 'Día 4 · Clave 3 — La Respuesta Consistente',
    clave: 'Clave 3: Respuesta',
    tasks: [
      'Elige una respuesta ante los despertares y compártela con quien más lo cuide.',
      'Aplica la misma respuesta cada noche esta semana, sin cambiar de método a mitad de la noche.',
      'Recuerda: la consistencia importa más que el método específico que elijas.',
    ],
    audioTrack: 'Clave 3: La Respuesta Consistente',
  },
  5: {
    title: 'Día 5 · Las 3 Claves juntas',
    clave: 'Integración',
    tasks: [
      'Revisa que ambiente + rutina + respuesta estén alineados hoy.',
      'Llena tu registro de sueño de esta noche (abajo, en "Mi registro").',
      'Anota una cosa que mejoró, aunque sea pequeña.',
    ],
    audioTrack: 'Integrando las 3 Claves',
  },
  6: {
    title: 'Día 6 · Ajusta con tus propios datos',
    clave: 'Análisis',
    tasks: [
      'Mira tus registros de los días 1-5: ¿hay un patrón en las horas o los despertares?',
      'Haz un solo ajuste pequeño (no varios a la vez) basado en lo que veas.',
      'Guarda la Guía de Emergencia Nocturna en tu pantalla de inicio para esta noche.',
    ],
    audioTrack: 'Solución de Problemas Comunes',
  },
  7: {
    title: 'Día 7 · Consolida tu plan',
    clave: 'Plan a futuro',
    tasks: [
      'Completa tu semana de registro y revisa el resumen.',
      'Decide qué de esta semana se queda como parte de tu rutina permanente.',
      'Recuerda: nuevas regresiones (4, 8-10 y 18 meses) son normales — vuelve aquí cuando aparezcan.',
    ],
    audioTrack: 'Plan de 7 Días Paso a Paso',
  },
}

// Guía de emergencia nocturna (para el botón fijo, modo oscuro)
export const EMERGENCY_GUIDE = {
  before: {
    duration: '60 segundos',
    steps: [
      '¿Se vuelve a dormir solo? Escucha antes de entrar.',
      'Respira profundo 3 veces antes de moverte.',
      'Enciende luz mínima, nunca la del techo.',
    ],
  },
  check: {
    duration: '90 segundos',
    steps: [
      'Revisa que el pañal esté limpio y seco.',
      'Toca la nuca para verificar temperatura normal.',
      'Asegúrate que no esté atrapado.',
      'Busca signos de enfermedad o malestar.',
    ],
  },
  minIntervention: {
    duration: '2-3 minutos',
    text: 'Toque suave en espalda o pancita sin alzar. Usa sonido "shhh" constante y mantén la oscuridad total.',
  },
  ifPersists: {
    text: 'Alimenta solo si corresponde al horario. Cambia de ambiente brevemente (máximo 5 min en brazos). Vuelve a la cuna cuando esté soñoliento.',
  },
  never: [
    'Encender luces brillantes del techo',
    'Jugar o hablar de manera estimulante',
    'Sacar al bebé de la habitación',
    'Cambiar el método cada noche',
  ],
  works: ['Consistencia: misma respuesta siempre', 'Paciencia: esta noche es una de muchas', 'Autocuidado: tú también necesitas dormir'],
}

export const MEDICAL_DISCLAIMER =
  'Esta guía es información educativa basada en el método de Mapa Parental y no sustituye el consejo de tu pediatra. Ante cualquier duda sobre la salud de tu bebé, consulta siempre a un profesional médico.'
