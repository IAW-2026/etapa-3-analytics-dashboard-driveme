const BASE_URL = (process.env.RIDER_APP_URL || '').replace(/\/$/, '')
const TOKEN = process.env.ANALYTICS_DASHBOARD_SECRET || ''

export interface RiderMetrics {
  pasajeros: {
    total: number
    activos: number
    inactivos: number
    nuevosUltimos30Dias: number
    reputacionPromedio: number
  }
  solicitudes: {
    total: number
    pendientes: number
    aceptadas: number
    canceladas: number
    tasaAceptacion: number
  }
  viajes: {
    total: number
    enCurso: number
    finalizados: number
    canceladosPorConductor: number
    calificacionPromedio: number
  }
}

export async function getRiderMetrics(): Promise<RiderMetrics | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/metricas`, {
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[Analytics] Error al obtener métricas de Rider App: ${res.status}`)
      return null
    }
    const data = await res.json()
    return data.metricas as RiderMetrics
  } catch (error) {
    console.error('[Analytics] Excepción al obtener métricas de Rider App:', error)
    return null
  }
}
