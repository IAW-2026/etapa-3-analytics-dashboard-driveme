import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import DonutChart from '@/components/DonutChart'
import { getDriverMetrics } from '@/lib/services/driver'

function formatPeso(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function buildStatusDonutData(metrics: any) {
  if (!metrics) return []
  const offline = metrics.conductoresActivos - metrics.conductoresDisponibles - metrics.conductoresOcupados
  return [
    { name: 'DISPONIBLE', value: metrics.conductoresDisponibles, color: '#34d399' },
    { name: 'OCUPADO', value: metrics.conductoresOcupados, color: '#fbbf24' },
    { name: 'OFFLINE', value: offline > 0 ? offline : 0, color: '#94a3b8' },
  ]
}

export default async function DriverAnalyticsPage() {
  const metrics = await getDriverMetrics()

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

  const statusData = buildStatusDonutData(metrics)

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Topbar title="Driver Analytics" subtitle="Fuente: Driver API — DriveMe" />

      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Bloque 1 — KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <KpiCard
            title="Total Conductores"
            value={metrics?.totalConductores || 0}
            accentColor="violet"
          />
          <KpiCard
            title="Conductores Activos"
            value={metrics?.conductoresActivos || 0}
            accentColor="cyan"
          />
          <KpiCard
            title="Ingresos Brutos"
            value={formatPeso(metrics?.ingresosBrutos)}
            accentColor="green"
          />
          <KpiCard
            title="Viajes Finalizados"
            value={metrics?.totalViajesCompletados || 0}
            accentColor="blue"
          />
          <KpiCard
            title="Viajes en Curso"
            value={metrics?.viajesEnCurso || 0}
            accentColor="amber"
          />
          <KpiCard
            title="Viajes Cancelados"
            value={metrics?.viajesCancelados || 0}
            accentColor="red"
          />
        </div>

        {/* Bloque 2 — Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
          {/* Main Info */}
          <div style={card}>
            <div style={cardTitle}>Desempeño de Flota</div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total de viajes completados históricamente</span>
                <span style={{ color: '#f8fafc', fontSize: '24px', fontWeight: 600 }}>{metrics?.totalViajesCompletados || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Porcentaje de actividad (Activos vs Total)</span>
                <span style={{ color: '#34d399', fontSize: '24px', fontWeight: 600 }}>
                  {metrics?.totalConductores 
                    ? Math.round((metrics.conductoresActivos / metrics.totalConductores) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Right stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Donut */}
            <div style={card}>
              <div style={cardTitle}>Estado actual de la flota activa</div>
              <DonutChart data={statusData} height={180} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
