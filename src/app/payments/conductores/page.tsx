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
    <div className="pb-12">
      <Topbar
        title="Conductores"
        subtitle="Fuente: Payments API — /api/pagos/admin/billeteras"
      />

      <div className="flex flex-col gap-6 px-0 md:px-2">
        {/* KPI summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="brutalist-card" style={{ overflow: 'hidden' }}>
          <div
            className="section-label"
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
              fontSize: '11px',
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
