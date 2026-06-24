export interface BancoCentral {
  fondosEmpresa: number
  fondosADebitar: number
  fondosDebitadosHistorico: number
  fechaActualizacion: string
}

export interface Billetera {
  id: string
  idConductor: string
  montoPendiente: number
  montoLiquidado: number
  fechaActualizacion: string
}

export interface Transaccion {
  id: string
  idViaje: string
  idPasajero: string
  idConductor: string
  metodoPago: 'EFECTIVO' | 'MERCADO_PAGO'
  monto: number
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'
  estadoLiquidacion: 'PENDIENTE' | 'LIQUIDADO'
  fechaCreacion: string
  fechaActualizacion: string
}

export interface Liquidacion {
  id: string
  idConductor: string
  montoPagado: number
  estado: string
  fechaProgramada: string
  fechaEjecutada: string | null
  detalle: { transacciones?: string[]; mensaje?: string } | string | null
  fechaCreacion: string
}

export interface User {
  id: string
  rol: 'RIDER' | 'DRIVER' | 'ADMIN'
}

export interface TransaccionesParams {
  estado?: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'
  estadoLiquidacion?: 'PENDIENTE' | 'LIQUIDADO'
  idConductor?: string
  idPasajero?: string
}

const BASE_URL = process.env.PAYMENTS_APP_URL ?? ''
const SECRET = process.env.ANALYTICS_DASHBOARD_SECRET ?? ''

async function paymentsRequest<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    const url = new URL(path, BASE_URL)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) url.searchParams.set(key, value)
      }
    }
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${SECRET}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function getBancoCentral(): Promise<BancoCentral | null> {
  return paymentsRequest<BancoCentral>('/api/pagos/admin/banco-central')
}

function toArray<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[]
  // API may wrap arrays in an envelope: { mensaje: "...", transacciones: [...] }
  if (result && typeof result === 'object') {
    for (const val of Object.values(result as Record<string, unknown>)) {
      if (Array.isArray(val)) return val as T[]
    }
  }
  return []
}

export async function getBilleteras(): Promise<Billetera[]> {
  return toArray<Billetera>(await paymentsRequest('/api/pagos/admin/billeteras'))
}

export async function getTransacciones(params?: TransaccionesParams): Promise<Transaccion[]> {
  const p: Record<string, string> = {}
  if (params?.estado) p.estado = params.estado
  if (params?.estadoLiquidacion) p.estadoLiquidacion = params.estadoLiquidacion
  if (params?.idConductor) p.idConductor = params.idConductor
  if (params?.idPasajero) p.idPasajero = params.idPasajero
  const raw = await paymentsRequest('/api/pagos/transacciones', p)
  console.log('[getTransacciones] raw type:', Array.isArray(raw) ? 'array' : typeof raw, '| keys:', raw && typeof raw === 'object' && !Array.isArray(raw) ? Object.keys(raw) : 'n/a')
  return toArray<Transaccion>(raw)
}

export async function getLiquidaciones(params?: { idConductor?: string }): Promise<Liquidacion[]> {
  const p: Record<string, string> = {}
  if (params?.idConductor) p.idConductor = params.idConductor
  return toArray<Liquidacion>(await paymentsRequest('/api/pagos/liquidaciones', p))
}

export async function getUsers(): Promise<User[]> {
  return toArray<User>(await paymentsRequest('/api/pagos/admin/users'))
}
