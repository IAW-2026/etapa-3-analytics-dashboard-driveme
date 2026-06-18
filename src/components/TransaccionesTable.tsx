import type { Transaccion } from '@/lib/services/payments'

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

interface TransaccionesTableProps {
  transacciones: Transaccion[]
  limit?: number
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  } catch {
    return '—'
  }
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(monto)
}

export default function TransaccionesTable({ transacciones, limit }: TransaccionesTableProps) {
  const rows = limit ? transacciones.slice(0, limit) : transacciones

  if (rows.length === 0) {
    return (
      <div style={{ color: '#475569', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>
        Sin transacciones
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Monto', 'Estado', 'Método', 'Fecha'].map((h) => (
              <th
                key={h}
                style={{
                  color: '#475569',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textAlign: 'left',
                  padding: '8px 12px',
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
          {rows.map((tx) => (
            <tr
              key={tx.id}
              style={{
                borderBottom: '1px solid rgba(51, 65, 85, 0.2)',
              }}
            >
              <td
                style={{
                  padding: '10px 12px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {tx.id.slice(0, 8)}…
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
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: ESTADO_COLORS[tx.estado] ?? '#94a3b8',
                    backgroundColor: ESTADO_BG[tx.estado] ?? 'rgba(148, 163, 184, 0.1)',
                  }}
                >
                  {tx.estado}
                </span>
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '12px',
                }}
              >
                {tx.metodoPago}
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#64748b',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatDate(tx.fechaCreacion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
