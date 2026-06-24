import Topbar from '@/components/Topbar'
import KpiCard from '@/components/KpiCard'
import { getFeedbackStats } from '@/lib/services/feedback'

export const dynamic = 'force-dynamic'

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

  return (
    <div className="pb-12">
      <Topbar title="Feedback Analytics" subtitle="Fuente: Feedback API — DriveMe" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiCard
          title="Total Calificaciones"
          value={stats.total_calificaciones}
          accentColor="violet"
        />
        <KpiCard
          title="Promedio General"
          value={`${Number(stats.promedio_general).toFixed(1)} ★`}
          accentColor="amber"
        />
        <KpiCard
          title="Reportes Pendientes"
          value={stats.reportes_pendientes}
          accentColor="red"
        />
        <KpiCard
          title="Calificaciones Hoy"
          value={stats.calificaciones_hoy}
          accentColor="green"
        />
      </div>
    </div>
  )
}
