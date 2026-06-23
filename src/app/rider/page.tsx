import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import DonutChart from '@/components/DonutChart'
import { getRiderMetrics } from '@/lib/services/rider'

function buildSolicitudesDonutData(metrics: NonNullable<Awaited<ReturnType<typeof getRiderMetrics>>>) {
  return [
    { name: 'PENDIENTES', value: metrics.solicitudesPendientes, color: 'var(--color-warning)' },
    { name: 'ACEPTADAS', value: metrics.solicitudesAceptadas, color: 'var(--color-success)' },
    { name: 'CANCELADAS', value: metrics.solicitudesCanceladas, color: 'var(--color-primary)' },
  ]
}

export default async function RiderAnalyticsPage() {
  const metrics = await getRiderMetrics()
  const donutData = metrics ? buildSolicitudesDonutData(metrics) : []

  if (!metrics) {
    return (
      <div className="pb-12">
        <Topbar title="Rider Analytics" subtitle="Fuente: Rider API — DriveMe" />
        <div className="brutalist-card p-8 text-center">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Sin datos disponibles — la API de Rider no respondió
          </div>
        </div>
      </div>
    )
  }

  const actividadPct = metrics.totalPasajeros
    ? Math.round((metrics.pasajerosActivos / metrics.totalPasajeros) * 100)
    : 0

  return (
    <div className="pb-12">
      <Topbar title="Rider Analytics" subtitle="Fuente: Rider API — DriveMe" />

      <div className="flex flex-col gap-6">

        {/* Bloque 1 — KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            title="Total Pasajeros"
            value={metrics.totalPasajeros}
            accentColor="violet"
          />
          <KpiCard
            title="Pasajeros Activos"
            value={metrics.pasajerosActivos}
            accentColor="cyan"
          />
          <KpiCard
            title="Reputación Promedio"
            value={`${Number(metrics.reputacionPromedio)?.toFixed(1) ?? '—'} ★`}
            accentColor="amber"
          />
          <KpiCard
            title="Total Solicitudes"
            value={metrics.totalSolicitudes}
            accentColor="blue"
          />
          <KpiCard
            title="Solicitudes Pendientes"
            value={metrics.solicitudesPendientes}
            accentColor="red"
          />
          <KpiCard
            title="Solicitudes Aceptadas"
            value={metrics.solicitudesAceptadas}
            accentColor="green"
          />
        </div>

        {/* Bloque 2 — Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          {/* Main Info */}
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Actividad de Pasajeros</div>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Porcentaje de actividad (Activos vs Total)</span>
                <span className="text-emerald-500 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                  {actividadPct}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Reputación promedio del sistema</span>
                <span className="text-amber-400 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(217, 119, 6, 0.4)' }}>
                  {Number(metrics.reputacionPromedio)?.toFixed(2) ?? '—'} ★
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Solicitudes canceladas</span>
                <span className="text-red-500 text-2xl font-semibold font-mono">
                  {metrics.solicitudesCanceladas}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Donut */}
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Distribución de solicitudes</div>
            <DonutChart data={donutData} height={180} />
          </div>
        </div>

      </div>
    </div>
  )
}
