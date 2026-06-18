import { Suspense } from 'react'
import Topbar from '@/components/Topbar'
import TransaccionesFilter from '@/components/TransaccionesFilter'
import type { Transaccion } from '@/lib/services/payments'
import { getTransacciones } from '@/lib/services/payments'

const ESTADO_COLORS: Record<string, string> = {
  CONFIRMADO: '#34d399',
  PENDIENTE: '#fbbf24',
  CANCELADO: '#f87171',
}
const ESTADO_BG: Record<string, string> = {
  CONFIRMADO: 'rgba(52, 211, 153, 0.1)',
  PENDIENTE: 'rgba(251, 191, 36, 0.1)',
  CANCELADO: 'rgba(248, 113, 113, 0.1)',
}
const LIQ_COLORS: Record<string, string> = {
  LIQUIDADO: '#22d3ee',
  PENDIENTE: '#a78bfa',
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(monto)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.03em',
        color,
        backgroundColor: bg,
      }}
    >
      {text}
    </span>
  )
}

function TransaccionesGrid({ transacciones }: { transacciones: Transaccion[] }) {
  const headers = [
    'ID',
    'Viaje',
    'Pasajero',
    'Conductor',
    'Método',
    'Monto',
    'Estado',
    'Liquidación',
    'Fecha',
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transacciones.map((tx) => (
            <tr key={tx.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.15)' }}>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {tx.id.slice(0, 8)}…
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {tx.idViaje?.slice(0, 8)}…
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {tx.idPasajero?.slice(0, 8)}…
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {tx.idConductor?.slice(0, 8)}…
              </td>
              <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>
                {tx.metodoPago}
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatMonto(tx.monto)}
              </td>
              <td style={{ padding: '10px 12px' }}>
                <Badge
                  text={tx.estado}
                  color={ESTADO_COLORS[tx.estado] ?? '#94a3b8'}
                  bg={ESTADO_BG[tx.estado] ?? 'rgba(148,163,184,0.1)'}
                />
              </td>
              <td style={{ padding: '10px 12px' }}>
                <Badge
                  text={tx.estadoLiquidacion}
                  color={LIQ_COLORS[tx.estadoLiquidacion] ?? '#94a3b8'}
                  bg={
                    tx.estadoLiquidacion === 'LIQUIDADO'
                      ? 'rgba(34,211,238,0.1)'
                      : 'rgba(167,139,250,0.1)'
                  }
                />
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatDate(tx.fechaCreacion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transacciones.length === 0 && (
        <div
          style={{ color: '#475569', fontSize: '13px', padding: '32px', textAlign: 'center' }}
        >
          Sin resultados para los filtros seleccionados
        </div>
      )}
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ estado?: string; estadoLiquidacion?: string }>
}

export default async function TransaccionesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const estado = params.estado as 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | undefined
  const estadoLiquidacion = params.estadoLiquidacion as 'PENDIENTE' | 'LIQUIDADO' | undefined

  const transacciones = await getTransacciones({ estado, estadoLiquidacion })

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Topbar title="Transacciones" subtitle="Fuente: Payments API — /api/pagos/transacciones" />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Filters */}
        <Suspense fallback={null}>
          <TransaccionesFilter />
        </Suspense>

        {/* Summary badge */}
        <div style={{ color: '#64748b', fontSize: '13px' }}>
          {transacciones.length} transacción{transacciones.length !== 1 ? 'es' : ''}
          {estado ? ` · estado: ${estado}` : ''}
          {estadoLiquidacion ? ` · liquidación: ${estadoLiquidacion}` : ''}
        </div>

        {/* Table */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)',
            overflow: 'hidden',
          }}
        >
          <TransaccionesGrid transacciones={transacciones} />
        </div>
      </div>
    </div>
  )
}
