import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import { getFeedbackStats } from '@/lib/services/feedback'

export const dynamic = 'force-dynamic'

function buildDistribucionData(dist: Record<string, number>) {
  return ['1', '2', '3', '4', '5'].map((k) => ({
    label: `${k}★`,
    value: dist[k] ?? 0,
    
  }))
}



function buildCalXDiaData(data: { fecha: string; cantidad: number }[]) {
  const map = new Map(data.map((d) => [d.fecha, d.cantidad]))
  const result: { label: string; value: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = date.toISOString().split('T')[0]
    const label = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
    result.push({ label, value: map.get(key) ?? 0 })
  }
  return result
}

export default async function FeedbackAnalyticsPage() {
  const stats = await getFeedbackStats()

  if (!stats) {
    return (
      <div className="pb-12">
        <Topbar title="Feedback Analytics" subtitle="Fuente: Feedback API — DriveMe" />
        <div className="brutalist-card p-8 text-center">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Sin datos disponibles — la API de Feedback no respondió
          </div>
        </div>
      </div>
    )
  }

  const distribucionData = buildDistribucionData(stats.distribucion_puntajes)
  const calXDiaData = buildCalXDiaData(stats.calificaciones_por_dia)
  const moderacionDonut = [
    { name: 'APROBADOS', value: stats.reportes_aprobados, color: 'var(--color-success)' },
    { name: 'RECHAZADOS', value: stats.reportes_rechazados, color: 'var(--color-primary)' },
  ]

  return (
    <div className="pb-12">
      <Topbar title="Feedback Analytics" subtitle="Fuente: Feedback API — DriveMe" />

      <div className="flex flex-col gap-6">

        {/* Bloque 1 — KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Total Calificaciones" value={stats.total_calificaciones} accentColor="violet" />
          <KpiCard title="Promedio General" value={`${Number(stats.promedio_general).toFixed(1)} ★`} accentColor="amber" />
          <KpiCard title="Calificaciones Hoy" value={stats.calificaciones_hoy} accentColor="green" />
          <KpiCard title="Reportes Pendientes" value={stats.reportes_pendientes} accentColor="red" />
          <KpiCard title="Reportes Aprobados" value={stats.reportes_aprobados} accentColor="cyan" />
          <KpiCard title="Tasa de Aprobación (Reportes)" value={`${Math.round(stats.tasa_aprobacion * 100)}%`} accentColor="blue" />
        </div>

        {/* Bloque 2 — Distribución de puntajes + Resolución de reportes */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Distribución de Puntajes</div>
            <BarChart data={distribucionData} color="var(--color-warning)" height={220} />
          </div>

          <div className="brutalist-card p-6">
            <div className="section-label mb-5 text-[11px]">Resolución de Reportes</div>
            <DonutChart data={moderacionDonut} height={180} />
          </div>
        </div>

        {/* Bloque 3 — Calificaciones por día */}
        <div className="brutalist-card p-6">
          <div className="section-label mb-5 text-[11px]">Calificaciones por Día (últimos 14 días)</div>
          <BarChart data={calXDiaData} color="var(--color-primary)" height={220} />
        </div>

      </div>
    </div>
  )
}
