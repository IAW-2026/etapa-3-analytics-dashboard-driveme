const BASE_URL = (process.env.FEEDBACK_APP_URL || '').replace(/\/$/, '')
const TOKEN = process.env.ANALYTICS_DASHBOARD_SECRET || ''

export interface FeedbackStats {
  total_calificaciones: number
  promedio_general: number
  reportes_pendientes: number
  calificaciones_hoy: number
  distribucion_puntajes: Record<string, number>
  calificaciones_por_dia: { fecha: string; cantidad: number }[]
  reportes_aprobados: number
  reportes_rechazados: number
  tasa_aprobacion: number
}

export async function getFeedbackStats(): Promise<FeedbackStats | null> {
  try {
    // Manda ANALYTICS_DASHBOARD_SECRET como x-api-key, igual que driver.ts y rider.ts
    const res = await fetch(`${BASE_URL}/api/stats`, {
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[Analytics] Error al obtener stats de Feedback App: ${res.status}`)
      return null
    }
    return await res.json() as FeedbackStats
  } catch (error) {
    console.error('[Analytics] Excepción al obtener stats de Feedback App:', error)
    return null
  }
}
