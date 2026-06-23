import type { Transaccion } from './services/payments'

export function ensureArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[]
  if (val && typeof val === 'object') {
    for (const v of Object.values(val as Record<string, unknown>)) {
      if (Array.isArray(v)) return v as T[]
    }
  }
  return []
}

export function filterByDateRange<T>(
  items: T[],
  dateFrom: string,
  dateTo: string,
  getDate: (item: T) => string,
): T[] {
  if (!dateFrom && !dateTo) return items
  return items.filter((item) => {
    const d = getDate(item).slice(0, 10)
    if (dateFrom && d < dateFrom) return false
    if (dateTo && d > dateTo) return false
    return true
  })
}

export function buildBarData(
  transacciones: Transaccion[],
  dateFrom: string,
  dateTo: string,
  mode: 'count' | 'monto' = 'count',
): { label: string; value: number }[] {
  const getValue = (txs: Transaccion[]) =>
    mode === 'count' ? txs.length : txs.reduce((s, tx) => s + Number(tx.monto), 0)

  if (dateFrom && dateTo) {
    const result: { label: string; value: number }[] = []
    const current = new Date(dateFrom)
    const end = new Date(dateTo)
    let days = 0
    while (current <= end && days < 90) {
      const key = current.toISOString().slice(0, 10)
      const label = `${current.getDate()}/${current.getMonth() + 1}`
      result.push({ label, value: getValue(transacciones.filter((tx) => tx.fechaCreacion?.startsWith(key))) })
      current.setDate(current.getDate() + 1)
      days++
    }
    return result
  }

  const now = new Date()
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (13 - i))
    const key = d.toISOString().slice(0, 10)
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      value: getValue(transacciones.filter((tx) => tx.fechaCreacion?.startsWith(key))),
    }
  })
}

export function buildDonutMetodoPago(
  transacciones: Transaccion[],
): { name: string; value: number; color: string }[] {
  const efectivo = transacciones.filter((tx) => tx.metodoPago === 'EFECTIVO').length
  const mp = transacciones.length - efectivo
  return [
    { name: 'EFECTIVO', value: efectivo, color: 'var(--color-primary)' },
    { name: 'MERCADO PAGO', value: mp, color: 'var(--color-info)' },
  ]
}
