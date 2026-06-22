'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function TransaccionesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const estado = searchParams.get('estado') ?? ''
  const estadoLiquidacion = searchParams.get('estadoLiquidacion') ?? ''

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/payments/transacciones?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>ESTADO:</label>
        <select
          className="brutalist-input font-mono"
          style={{ padding: '8px 12px', fontSize: '12px', minWidth: '140px', color: 'var(--color-text-primary)' }}
          value={estado}
          onChange={(e) => update('estado', e.target.value)}
        >
          <option value="" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>TODOS</option>
          <option value="PENDIENTE" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>PENDIENTE</option>
          <option value="CONFIRMADO" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>CONFIRMADO</option>
          <option value="CANCELADO" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>CANCELADO</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>LIQUIDACIÓN:</label>
        <select
          className="brutalist-input font-mono"
          style={{ padding: '8px 12px', fontSize: '12px', minWidth: '140px', color: 'var(--color-text-primary)' }}
          value={estadoLiquidacion}
          onChange={(e) => update('estadoLiquidacion', e.target.value)}
        >
          <option value="" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>TODOS</option>
          <option value="PENDIENTE" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>PENDIENTE</option>
          <option value="LIQUIDADO" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>LIQUIDADO</option>
        </select>
      </div>
    </div>
  )
}
