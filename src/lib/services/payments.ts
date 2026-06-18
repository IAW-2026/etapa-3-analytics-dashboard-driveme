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
  detalle: string
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
const SECRET = process.env.PAYMENTS_SERVICE_SECRET ?? ''

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
      next: { revalidate: 30 },
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

export async function getBilleteras(): Promise<Billetera[]> {
  return (await paymentsRequest<Billetera[]>('/api/pagos/admin/billeteras')) ?? []
}

export async function getTransacciones(params?: TransaccionesParams): Promise<Transaccion[]> {
  const p: Record<string, string> = {}
  if (params?.estado) p.estado = params.estado
  if (params?.estadoLiquidacion) p.estadoLiquidacion = params.estadoLiquidacion
  if (params?.idConductor) p.idConductor = params.idConductor
  if (params?.idPasajero) p.idPasajero = params.idPasajero
  return (await paymentsRequest<Transaccion[]>('/api/pagos/transacciones', p)) ?? []
}

export async function getLiquidaciones(params?: { idConductor?: string }): Promise<Liquidacion[]> {
  const p: Record<string, string> = {}
  if (params?.idConductor) p.idConductor = params.idConductor
  return (await paymentsRequest<Liquidacion[]>('/api/pagos/liquidaciones', p)) ?? []
}

export async function getUsers(): Promise<User[]> {
  return (await paymentsRequest<User[]>('/api/pagos/admin/users')) ?? []
}
