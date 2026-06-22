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
      <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>
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
                className="section-label"
                style={{
                  fontSize: '11px',
                  textAlign: 'left',
                  padding: '12px 12px',
                  borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
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
              className="hover:bg-red-900/10 transition-colors"
              style={{
                borderBottom: '1px solid rgba(220, 38, 38, 0.1)',
              }}
            >
              <td
                style={{
                  padding: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                {tx.id.slice(0, 8)}…
              </td>
              <td
                style={{
                  padding: '12px',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatMonto(tx.monto)}
              </td>
              <td style={{ padding: '12px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-input)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: ESTADO_COLORS[tx.estado] ?? 'var(--color-text-muted)',
                    backgroundColor: ESTADO_BG[tx.estado] ?? 'rgba(107, 114, 128, 0.1)',
                    border: ESTADO_BORDER[tx.estado] ?? '1px solid rgba(107, 114, 128, 0.3)',
                    textTransform: 'uppercase'
                  }}
                >
                  {tx.estado}
                </span>
              </td>
              <td
                style={{
                  padding: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                }}
              >
                {tx.metodoPago}
              </td>
              <td
                style={{
                  padding: '12px',
                  color: 'var(--color-text-muted)',
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
