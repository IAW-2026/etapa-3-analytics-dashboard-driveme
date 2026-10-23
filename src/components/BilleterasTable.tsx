import type { Billetera } from '@/lib/services/payments'

interface BilleterasTableProps {
  billeteras: Billetera[]
  limit?: number
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(monto)
}

export default function BilleterasTable({ billeteras, limit }: BilleterasTableProps) {
  const rows = limit ? billeteras.slice(0, limit) : billeteras

  if (rows.length === 0) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>
        Sin billeteras
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Conductor', 'Liquidado', 'Pendiente'].map((h) => (
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
          {rows.map((b) => (
            <tr key={b.id} className="hover:bg-red-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(220, 38, 38, 0.1)' }}>
              <td
                style={{
                  padding: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                }}
              >
                {b.idConductor.slice(0, 8)}…
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
                {formatMonto(b.montoLiquidado)}
              </td>
              <td
                style={{
                  padding: '12px',
                  color: '#EF4444',
                  fontSize: '13px',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
                }}
              >
                {formatMonto(b.montoPendiente)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
