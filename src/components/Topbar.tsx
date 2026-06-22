import { Bell, Settings, User } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-8 md:py-6 mb-6 rounded-none md:rounded-lg"
      style={{
        borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
        backgroundColor: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="mb-4 md:mb-0 ml-12 md:ml-0">
        <h1
          className="font-michroma text-lg md:text-2xl"
          style={{
            color: 'var(--color-primary)',
            fontWeight: 600,
            margin: 0,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(220, 38, 38, 0.2)',
          }}
        >
          {title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', margin: '4px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {subtitle}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-red-500" />
          <Settings size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-red-500" />
          <User size={18} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-red-500" />
        </div>
        <div className="hidden md:block" style={{ width: '1px', height: '24px', backgroundColor: 'rgba(220, 38, 38, 0.2)' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-primary)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '0px',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)',
              animation: 'pulse 2s infinite',
            }}
          />
          Live
        </div>
      </div>
    </div>
  )
}
