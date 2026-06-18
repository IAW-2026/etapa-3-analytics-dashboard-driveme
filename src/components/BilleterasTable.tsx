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
      <div style={{ color: '#475569', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>
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
          {rows.map((b) => (
            <tr key={b.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.2)' }}>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {b.idConductor.slice(0, 8)}…
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#22d3ee',
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, monospace',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatMonto(b.montoLiquidado)}
              </td>
              <td
                style={{
                  padding: '10px 12px',
                  color: '#a78bfa',
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, monospace',
                  whiteSpace: 'nowrap',
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
