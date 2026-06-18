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
    { name: 'CONFIRMADO', value: counts.CONFIRMADO, color: '#34d399' },
    { name: 'PENDIENTE', value: counts.PENDIENTE, color: '#fbbf24' },
    { name: 'CANCELADO', value: counts.CANCELADO, color: '#f87171' },
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

  const card: React.CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
    padding: '20px',
    backdropFilter: 'blur(4px)',
  }

  const cardTitle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  }

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Topbar title="Payments Overview" subtitle="Fuente: Payments API — DriveMe" />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Bloque 1 — KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
          {/* Bar chart */}
          <div style={card}>
            <div style={cardTitle}>Transacciones por día — últimos 14 días</div>
            <BarChart data={barData} color="#22d3ee" height={220} />
          </div>

          {/* Right stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Donut */}
            <div style={card}>
              <div style={cardTitle}>Estado de transacciones</div>
              <DonutChart data={donutData} height={180} />
            </div>

            {/* Método de pago */}
            <div style={card}>
              <div style={cardTitle}>Método de pago</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>EFECTIVO</span>
                    <span
                      style={{
                        color: '#22d3ee',
                        fontSize: '12px',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {metodoPago.efectivo}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'rgba(51, 65, 85, 0.4)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${metodoPago.efectivo}%`,
                        backgroundColor: '#22d3ee',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>MERCADO PAGO</span>
                    <span
                      style={{
                        color: '#a78bfa',
                        fontSize: '12px',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {metodoPago.mercadoPago}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'rgba(51, 65, 85, 0.4)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${metodoPago.mercadoPago}%`,
                        backgroundColor: '#a78bfa',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 3 — Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={card}>
            <div style={cardTitle}>Últimas transacciones</div>
            <TransaccionesTable transacciones={transacciones} limit={8} />
          </div>
          <div style={card}>
            <div style={cardTitle}>Top conductores</div>
            <BilleterasTable billeteras={billeterasSorted} limit={8} />
          </div>
        </div>

      </div>
    </div>
  )
}
