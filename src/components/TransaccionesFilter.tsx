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

  const selectStyle: React.CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: '6px 10px',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Estado:</label>
        <select
          style={selectStyle}
          value={estado}
          onChange={(e) => update('estado', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CONFIRMADO">CONFIRMADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>
          Liquidación:
        </label>
        <select
          style={selectStyle}
          value={estadoLiquidacion}
          onChange={(e) => update('estadoLiquidacion', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="LIQUIDADO">LIQUIDADO</option>
        </select>
      </div>
    </div>
  )
}
