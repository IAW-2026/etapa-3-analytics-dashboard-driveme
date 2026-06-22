type AccentColor = 'cyan' | 'violet' | 'green' | 'amber' | 'blue' | 'red'

const ACCENT_COLORS: Record<AccentColor, string> = {
  cyan: 'var(--color-text-primary)',
  violet: 'var(--color-secondary)',
  green: 'var(--color-success)',
  amber: 'var(--color-warning)',
  blue: 'var(--color-info)',
  red: 'var(--color-primary)',
}

interface KpiCardProps {
  title: string
  value: string | number | null | undefined
  subtitle?: string
  accentColor: AccentColor
}

export default function KpiCard({ title, value, subtitle, accentColor }: KpiCardProps) {
  const color = ACCENT_COLORS[accentColor]

  return (
    <div
      className="brutalist-card"
      style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="section-label"
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      <div
        className="font-mono"
        style={{
          color: value != null ? color : 'var(--color-text-muted)',
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textShadow: value != null && accentColor === 'red' ? '0 0 15px rgba(220, 38, 38, 0.4)' : 'none',
        }}
      >
        {value != null ? value : '—'}
      </div>
      {subtitle && (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '12px', letterSpacing: '0.02em' }}>{subtitle}</div>
      )}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: color,
          opacity: 0.8,
          boxShadow: `0 0 10px ${color}`
        }}
      />
    </div>
  )
}
