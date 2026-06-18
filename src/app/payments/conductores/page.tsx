import Topbar from '@/components/Topbar'
import BilleterasTable from '@/components/BilleterasTable'
import KpiCard from '@/components/KpiCard'
import { getBilleteras } from '@/lib/services/payments'

function formatPeso(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function ConductoresPage() {
  const billeteras = await getBilleteras()
  const sorted = [...billeteras].sort((a, b) => b.montoLiquidado - a.montoLiquidado)

  const totalLiquidado = billeteras.reduce((sum, b) => sum + b.montoLiquidado, 0)
  const totalPendiente = billeteras.reduce((sum, b) => sum + b.montoPendiente, 0)

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Topbar
        title="Conductores"
        subtitle="Fuente: Payments API — /api/pagos/admin/billeteras"
      />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <KpiCard title="Conductores" value={billeteras.length} accentColor="amber" />
          <KpiCard
            title="Total liquidado"
            value={formatPeso(totalLiquidado)}
            accentColor="cyan"
          />
          <KpiCard
            title="Total pendiente"
            value={formatPeso(totalPendiente)}
            accentColor="violet"
          />
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
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Billeteras de conductores — ordenado por monto liquidado
          </div>
          <BilleterasTable billeteras={sorted} />
        </div>
      </div>
    </div>
  )
}
