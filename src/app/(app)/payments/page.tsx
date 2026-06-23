export const dynamic = 'force-dynamic'

import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import TransaccionesTable from '@/components/TransaccionesTable'
import BilleterasTable from '@/components/BilleterasTable'
import { getBancoCentral, getBilleteras, getTransacciones } from '@/lib/services/payments'

function formatPeso(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function buildBarChartData(transacciones: Awaited<ReturnType<typeof getTransacciones>>) {
  const now = new Date()
  const days: { label: string; value: number }[] = []

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = `${d.getDate()}/${d.getMonth() + 1}`
    const count = transacciones.filter((tx) => tx.fechaCreacion?.startsWith(key)).length
    days.push({ label, value: count })
  }

  return days
}

function buildDonutData(transacciones: Awaited<ReturnType<typeof getTransacciones>>) {
  const counts = { CONFIRMADO: 0, PENDIENTE: 0, CANCELADO: 0 }
  for (const tx of transacciones) {
    if (tx.estado in counts) counts[tx.estado as keyof typeof counts]++
  }
  return [
    { name: 'CONFIRMADO', value: counts.CONFIRMADO, color: 'var(--color-success)' },
    { name: 'PENDIENTE', value: counts.PENDIENTE, color: 'var(--color-warning)' },
    { name: 'CANCELADO', value: counts.CANCELADO, color: 'var(--color-error)' },
  ]
}

function buildMetodoPagoData(transacciones: Awaited<ReturnType<typeof getTransacciones>>) {
  const total = transacciones.length
  if (total === 0) return { efectivo: 0, mercadoPago: 0 }
  const efectivo = transacciones.filter((tx) => tx.metodoPago === 'EFECTIVO').length
  return {
    efectivo: Math.round((efectivo / total) * 100),
    mercadoPago: Math.round(((total - efectivo) / total) * 100),
  }
}

export default async function PaymentsOverviewPage() {
  const [bancoCentral, billeteras, transacciones] = await Promise.all([
    getBancoCentral(),
    getBilleteras(),
    getTransacciones(),
  ])

  const billeterasSorted = [...billeteras].sort((a, b) => b.montoLiquidado - a.montoLiquidado)
  const barData = buildBarChartData(transacciones)
  const donutData = buildDonutData(transacciones)
  const metodoPago = buildMetodoPagoData(transacciones)

  return (
    <div className="pb-12">
      <Topbar title="Payments Overview" subtitle="Fuente: Payments API — DriveMe" />

      <div className="flex flex-col gap-6 px-0 md:px-2">

        {/* Bloque 1 — KPI cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Ingresos empresa"
            value={formatPeso(bancoCentral?.fondosEmpresa)}
            accentColor="cyan"
          />
          <KpiCard
            title="Pendiente conductores"
            value={formatPeso(bancoCentral?.fondosADebitar)}
            accentColor="violet"
          />
          <KpiCard
            title="Total transacciones"
            value={transacciones.length}
            accentColor="green"
          />
          <KpiCard
            title="Conductores activos"
            value={billeteras.length}
            accentColor="amber"
          />
        </div>

        {/* Bloque 2 — Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {/* Bar chart */}
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Transacciones por día — últimos 14 días</div>
            <BarChart data={barData} color="var(--color-primary)" height={220} />
          </div>

          {/* Right stack */}
          <div className="flex flex-col gap-4">
            {/* Donut */}
            <div className="brutalist-card p-6">
              <div className="section-label mb-5 text-[11px]">Estado de transacciones</div>
              <DonutChart data={donutData} height={180} />
            </div>

            {/* Método de pago */}
            <div className="brutalist-card p-6">
              <div className="section-label mb-5 text-[11px]">Método de pago</div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px', letterSpacing: '0.05em' }}>EFECTIVO</span>
                    <span
                      className="font-mono"
                      style={{
                        color: 'var(--color-primary)',
                        fontSize: '12px',
                        textShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
                      }}
                    >
                      {metodoPago.efectivo}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${metodoPago.efectivo}%`,
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--color-primary)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px', letterSpacing: '0.05em' }}>MERCADO PAGO</span>
                    <span
                      className="font-mono"
                      style={{
                        color: 'var(--color-secondary)',
                        fontSize: '12px',
                        textShadow: '0 0 10px rgba(75, 85, 99, 0.4)',
                      }}
                    >
                      {metodoPago.mercadoPago}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${metodoPago.mercadoPago}%`,
                        backgroundColor: 'var(--color-secondary)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--color-secondary)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 3 — Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Últimas transacciones</div>
            <TransaccionesTable transacciones={transacciones} limit={8} />
          </div>
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Top conductores</div>
            <BilleterasTable billeteras={billeterasSorted} limit={8} />
          </div>
        </div>

      </div>
    </div>
  )
}
