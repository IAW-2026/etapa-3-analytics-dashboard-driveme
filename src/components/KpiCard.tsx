type AccentColor = 'cyan' | 'violet' | 'green' | 'amber'

const ACCENT_COLORS: Record<AccentColor, string> = {
  cyan: '#22d3ee',
  violet: '#a78bfa',
  green: '#34d399',
  amber: '#fbbf24',
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
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '8px',
        padding: '20px',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          color: '#94a3b8',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: value != null ? color : '#475569',
          fontSize: '28px',
          fontWeight: 700,
          fontFamily: 'ui-monospace, monospace',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        {value != null ? value : '—'}
      </div>
      {subtitle && (
        <div style={{ color: '#64748b', fontSize: '12px' }}>{subtitle}</div>
      )}
    </div>
  )
}
