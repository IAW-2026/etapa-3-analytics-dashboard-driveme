const BASE_URL = process.env.DRIVER_APP_URL || ''
const TOKEN = process.env.ANALYTICS_DASHBOARD_SECRET || ''

export interface DriverMetrics {
  totalConductores: number;
  conductoresActivos: number;
  conductoresDisponibles: number;
  conductoresOcupados: number;
  totalViajesCompletados: number;
  viajesCancelados: number;
  viajesEnCurso: number;
  viajesAceptados: number;
  ingresosBrutos: number;
}

export async function getDriverMetrics(): Promise<DriverMetrics | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/metricas`, {
      headers: {
        'x-api-key': TOKEN,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error(`[Analytics] Error al obtener métricas de Driver App: ${res.status}`)
      return null;
    }

    const data = await res.json()
    return data.metricas as DriverMetrics
  } catch (error) {
    console.error('[Analytics] Excepción al obtener métricas de Driver App:', error)
    return null;
  }
}
