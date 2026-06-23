import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import DonutChart from '@/components/DonutChart'
import { getDriverMetrics } from '@/lib/services/driver'

export const dynamic = 'force-dynamic'

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
    { name: 'DISPONIBLE', value: metrics.conductoresDisponibles, color: 'var(--color-success)' },
    { name: 'OCUPADO', value: metrics.conductoresOcupados, color: 'var(--color-warning)' },
    { name: 'OFFLINE', value: offline > 0 ? offline : 0, color: 'var(--color-text-muted)' },
  ]
}

export default async function DriverAnalyticsPage() {
  const metrics = await getDriverMetrics()
  const statusData = buildStatusDonutData(metrics)

  return (
    <div className="pb-12">
      <Topbar title="Driver Analytics" subtitle="Fuente: Driver API — DriveMe" />

      <div className="flex flex-col gap-6">
        
        {/* Bloque 1 — KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {/* Main Info */}
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Desempeño de Flota</div>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Total de viajes completados históricamente</span>
                <span className="text-gray-100 text-2xl font-semibold font-mono">{metrics?.totalViajesCompletados || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Porcentaje de actividad (Activos vs Total)</span>
                <span className="text-emerald-500 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                  {metrics?.totalConductores 
                    ? Math.round((metrics.conductoresActivos / metrics.totalConductores) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Right stack */}
          <div className="flex flex-col gap-4">
            {/* Donut */}
            <div className="brutalist-card p-6">
              <div className="section-label mb-5 text-[11px]">Estado actual de la flota activa</div>
              <DonutChart data={statusData} height={180} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
