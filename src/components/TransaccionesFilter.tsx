'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '12px',
  color: 'var(--color-text-primary)',
  width: '180px',
}

export default function TransaccionesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const estado = searchParams.get('estado') ?? ''
  const estadoLiquidacion = searchParams.get('estadoLiquidacion') ?? ''
  const pasajeroFromUrl = searchParams.get('idPasajero') ?? ''
  const conductorFromUrl = searchParams.get('idConductor') ?? ''

  const [idPasajeroInput, setIdPasajeroInput] = useState(pasajeroFromUrl)
  const [idConductorInput, setIdConductorInput] = useState(conductorFromUrl)

  // Refs so debounce closures always read the latest URL value
  const pasajeroFromUrlRef = useRef(pasajeroFromUrl)
  const conductorFromUrlRef = useRef(conductorFromUrl)
  const pasajeroFirstRender = useRef(true)
  const conductorFirstRender = useRef(true)

  // Keep refs up-to-date on every render
  pasajeroFromUrlRef.current = pasajeroFromUrl
  conductorFromUrlRef.current = conductorFromUrl

  // Sync inputs when URL changes externally (e.g., click-to-filter from table rows)
  useEffect(() => { setIdPasajeroInput(pasajeroFromUrl) }, [pasajeroFromUrl])
  useEffect(() => { setIdConductorInput(conductorFromUrl) }, [conductorFromUrl])

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/payments/transacciones?${params.toString()}`)
  }

  // Debounced URL push — skip if input already matches URL (avoids loop after external sync)
  useEffect(() => {
    if (pasajeroFirstRender.current) { pasajeroFirstRender.current = false; return }
    if (idPasajeroInput === pasajeroFromUrlRef.current) return
    const t = setTimeout(() => update('idPasajero', idPasajeroInput), 500)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPasajeroInput])

  useEffect(() => {
    if (conductorFirstRender.current) { conductorFirstRender.current = false; return }
    if (idConductorInput === conductorFromUrlRef.current) return
    const t = setTimeout(() => update('idConductor', idConductorInput), 500)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idConductorInput])

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>ESTADO</label>
        <select
          className="brutalist-input font-mono"
          style={inputStyle}
          value={estado}
          onChange={(e) => update('estado', e.target.value)}
        >
          <option value="" style={{ background: 'var(--color-surface)' }}>TODOS</option>
          <option value="PENDIENTE" style={{ background: 'var(--color-surface)' }}>PENDIENTE</option>
          <option value="CONFIRMADO" style={{ background: 'var(--color-surface)' }}>CONFIRMADO</option>
          <option value="CANCELADO" style={{ background: 'var(--color-surface)' }}>CANCELADO</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>LIQUIDACIÓN</label>
        <select
          className="brutalist-input font-mono"
          style={inputStyle}
          value={estadoLiquidacion}
          onChange={(e) => update('estadoLiquidacion', e.target.value)}
        >
          <option value="" style={{ background: 'var(--color-surface)' }}>TODOS</option>
          <option value="PENDIENTE" style={{ background: 'var(--color-surface)' }}>PENDIENTE</option>
          <option value="LIQUIDADO" style={{ background: 'var(--color-surface)' }}>LIQUIDADO</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>PASAJERO</label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <input
            type="text"
            className="brutalist-input font-mono"
            style={{ ...inputStyle, paddingRight: idPasajeroInput ? '28px' : undefined }}
            placeholder="Filtrar por ID…"
            value={idPasajeroInput}
            onChange={(e) => setIdPasajeroInput(e.target.value)}
          />
          {idPasajeroInput && (
            <button
              onClick={() => setIdPasajeroInput('')}
              style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: 1, padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="section-label" style={{ fontSize: '10px' }}>CONDUCTOR</label>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <input
            type="text"
            className="brutalist-input font-mono"
            style={{ ...inputStyle, paddingRight: idConductorInput ? '28px' : undefined }}
            placeholder="Filtrar por ID…"
            value={idConductorInput}
            onChange={(e) => setIdConductorInput(e.target.value)}
          />
          {idConductorInput && (
            <button
              onClick={() => setIdConductorInput('')}
              style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: 1, padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
