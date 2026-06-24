'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import type { Transaccion } from '@/lib/services/payments'

const ESTADO_COLORS: Record<string, string> = {
  CONFIRMADO: 'var(--color-success)',
  PENDIENTE: 'var(--color-warning)',
  CANCELADO: 'var(--color-error)',
}
const ESTADO_BG: Record<string, string> = {
  CONFIRMADO: 'rgba(5, 150, 105, 0.15)',
  PENDIENTE: 'rgba(217, 119, 6, 0.15)',
  CANCELADO: 'rgba(239, 68, 68, 0.15)',
}
const ESTADO_BORDER: Record<string, string> = {
  CONFIRMADO: '1px solid rgba(5, 150, 105, 0.3)',
  PENDIENTE: '1px solid rgba(217, 119, 6, 0.3)',
  CANCELADO: '1px solid rgba(239, 68, 68, 0.3)',
}
const LIQ_COLORS: Record<string, string> = {
  LIQUIDADO: 'var(--color-info)',
  PENDIENTE: 'var(--color-secondary)',
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(monto)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return '—' }
}

function StatusBadge({ text, color, bg, border }: { text: string; color: string; bg: string; border?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-input)',
      fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
      color, backgroundColor: bg, border: border ?? 'none',
    }}>
      {text}
    </span>
  )
}

interface Props {
  transacciones: Transaccion[]
}

export default function TransaccionesFullTable({ transacciones }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setFilter(key: 'idPasajero' | 'idConductor', value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/payments/transacciones?${params.toString()}`)
  }

  const headers = ['ID', 'Viaje', 'Pasajero', 'Conductor', 'Método', 'Monto', 'Estado', 'Liquidación', 'Fecha']

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="section-label" style={{ fontSize: '11px', textAlign: 'left', padding: '12px', borderBottom: '1px solid rgba(220,38,38,0.2)', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transacciones.map((tx) => (
            <tr key={tx.id} className="hover:bg-red-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
              <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '11px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                {tx.id.slice(0, 8)}…
              </td>
              <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                {tx.idViaje ? `${tx.idViaje.slice(0, 8)}…` : '—'}
              </td>

              {/* Pasajero — with filter button */}
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                    {tx.idPasajero?.slice(0, 8)}…
                  </span>
                  <button
                    onClick={() => setFilter('idPasajero', tx.idPasajero)}
                    title={tx.idPasajero}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.4, transition: 'opacity 150ms' }}
                    className="hover:opacity-100"
                  >
                    <Filter size={11} />
                  </button>
                </div>
              </td>

              {/* Conductor — with filter button */}
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                    {tx.idConductor ? `${tx.idConductor.slice(0, 8)}…` : '—'}
                  </span>
                  {tx.idConductor && (
                    <button
                      onClick={() => setFilter('idConductor', tx.idConductor!)}
                      title={tx.idConductor}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.4, transition: 'opacity 150ms' }}
                      className="hover:opacity-100"
                    >
                      <Filter size={11} />
                    </button>
                  )}
                </div>
              </td>

              <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>{tx.metodoPago}</td>
              <td style={{ padding: '12px', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)', whiteSpace: 'nowrap' }}>
                {formatMonto(tx.monto)}
              </td>
              <td style={{ padding: '12px' }}>
                <StatusBadge
                  text={tx.estado}
                  color={ESTADO_COLORS[tx.estado] ?? 'var(--color-text-muted)'}
                  bg={ESTADO_BG[tx.estado] ?? 'rgba(107,114,128,0.1)'}
                  border={ESTADO_BORDER[tx.estado] ?? '1px solid rgba(107,114,128,0.3)'}
                />
              </td>
              <td style={{ padding: '12px' }}>
                <StatusBadge
                  text={tx.estadoLiquidacion}
                  color={LIQ_COLORS[tx.estadoLiquidacion] ?? 'var(--color-text-muted)'}
                  bg={tx.estadoLiquidacion === 'LIQUIDADO' ? 'rgba(59,130,246,0.15)' : 'rgba(75,85,99,0.15)'}
                  border={tx.estadoLiquidacion === 'LIQUIDADO' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(75,85,99,0.3)'}
                />
              </td>
              <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                {formatDate(tx.fechaCreacion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transacciones.length === 0 && (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '32px', textAlign: 'center' }}>
          Sin resultados para los filtros seleccionados
        </div>
      )}
    </div>
  )
}
