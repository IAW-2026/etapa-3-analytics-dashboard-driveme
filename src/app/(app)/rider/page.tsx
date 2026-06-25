import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import DonutChart from '@/components/DonutChart'
import { getRiderMetrics } from '@/lib/services/rider'

export const dynamic = 'force-dynamic'

function buildSolicitudesDonutData(metrics: NonNullable<Awaited<ReturnType<typeof getRiderMetrics>>>) {
  return [
    { name: 'PENDIENTES', value: metrics.solicitudes.pendientes, color: 'var(--color-warning)' },
    { name: 'ACEPTADAS', value: metrics.solicitudes.aceptadas, color: 'var(--color-success)' },
    { name: 'CANCELADAS', value: metrics.solicitudes.canceladas, color: 'var(--color-primary)' },
  ]
}

function buildViajesDonutData(metrics: NonNullable<Awaited<ReturnType<typeof getRiderMetrics>>>) {
  return [
    { name: 'EN CURSO', value: metrics.viajes.enCurso, color: 'var(--color-warning)' },
    { name: 'FINALIZADOS', value: metrics.viajes.finalizados, color: 'var(--color-success)' },
    { name: 'CANCELADOS', value: metrics.viajes.canceladosPorConductor, color: 'var(--color-primary)' },
  ]
}

export default async function RiderAnalyticsPage() {
  const metrics = await getRiderMetrics()
  const solicitudesDonut = metrics ? buildSolicitudesDonutData(metrics) : []
  const viajesDonut = metrics ? buildViajesDonutData(metrics) : []

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

  const actividadPct = metrics.pasajeros.total
    ? Math.round((metrics.pasajeros.activos / metrics.pasajeros.total) * 100)
    : 0

  return (
    <div className="pb-12">
      <Topbar title="Rider Analytics" subtitle="Fuente: Rider API — DriveMe" />

      <div className="flex flex-col gap-6">

        {/* Bloque 1 — KPI cards: Pasajeros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            title="Total Pasajeros"
            value={metrics.pasajeros.total}
            accentColor="violet"
          />
          <KpiCard
            title="Pasajeros Activos"
            value={metrics.pasajeros.activos}
            accentColor="cyan"
          />
          <KpiCard
            title="Pasajeros Inactivos"
            value={metrics.pasajeros.inactivos}
            accentColor="red"
          />
          <KpiCard
            title="Nuevos (últimos 30 días)"
            value={metrics.pasajeros.nuevosUltimos30Dias}
            accentColor="green"
          />
          <KpiCard
            title="Reputación Promedio"
            value={`${Number(metrics.pasajeros.reputacionPromedio)?.toFixed(1) ?? '—'} ★`}
            accentColor="amber"
          />
          <KpiCard
            title="Tasa de Actividad"
            value={`${actividadPct}%`}
            accentColor="blue"
          />
        </div>

        {/* Bloque 2 — Solicitudes: KPIs + Donut */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Solicitudes de Viaje</div>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Total de solicitudes</span>
                <span className="text-gray-100 text-2xl font-semibold font-mono">{metrics.solicitudes.total}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Pendientes</span>
                <span className="text-amber-400 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(217, 119, 6, 0.4)' }}>
                  {metrics.solicitudes.pendientes}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Aceptadas</span>
                <span className="text-emerald-500 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                  {metrics.solicitudes.aceptadas}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Canceladas</span>
                <span className="text-red-500 text-2xl font-semibold font-mono">
                  {metrics.solicitudes.canceladas}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-gray-400 text-sm">Tasa de aceptación</span>
                <span className="text-emerald-500 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                  {metrics.solicitudes.tasaAceptacion}%
                </span>
              </div>
            </div>
          </div>

          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Distribución de Solicitudes</div>
            <DonutChart data={solicitudesDonut} height={180} />
          </div>
        </div>

        {/* Bloque 3 — Viajes: KPIs + Donut */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Viajes</div>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Total de viajes</span>
                <span className="text-gray-100 text-2xl font-semibold font-mono">{metrics.viajes.total}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">En curso</span>
                <span className="text-amber-400 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(217, 119, 6, 0.4)' }}>
                  {metrics.viajes.enCurso}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Finalizados</span>
                <span className="text-emerald-500 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                  {metrics.viajes.finalizados}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-red-900/20">
                <span className="text-gray-400 text-sm">Cancelados por conductor</span>
                <span className="text-red-500 text-2xl font-semibold font-mono">
                  {metrics.viajes.canceladosPorConductor}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-gray-400 text-sm">Calificación promedio</span>
                <span className="text-amber-400 text-2xl font-semibold font-mono" style={{ textShadow: '0 0 10px rgba(217, 119, 6, 0.4)' }}>
                  {Number(metrics.viajes.calificacionPromedio)?.toFixed(1) ?? '—'} ★
                </span>
              </div>
            </div>
          </div>

          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Distribución de Viajes</div>
            <DonutChart data={viajesDonut} height={180} />
          </div>
        </div>

      </div>
    </div>
  )
}
