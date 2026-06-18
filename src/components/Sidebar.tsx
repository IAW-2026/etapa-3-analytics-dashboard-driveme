'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const APPS = [
  { name: 'Payments', href: '/payments', color: '#22d3ee', dot: '#22d3ee', soon: false },
  { name: 'Driver', href: '/driver', color: '#a78bfa', dot: '#a78bfa', soon: true },
  { name: 'Rider', href: '/rider', color: '#34d399', dot: '#34d399', soon: true },
  { name: 'Feedback', href: '/feedback', color: '#fbbf24', dot: '#fbbf24', soon: true },
]

const PAYMENTS_VIEWS = [
  { name: 'Overview', href: '/payments' },
  { name: 'Transacciones', href: '/payments/transacciones' },
  { name: 'Conductores', href: '/payments/conductores' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isPaymentsActive = pathname.startsWith('/payments')

  function isActive(href: string) {
    if (href === '/payments') return pathname === '/payments'
    return pathname.startsWith(href)
  }

  return (
    <aside
      style={{
        width: '200px',
        minWidth: '200px',
        minHeight: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRight: '1px solid rgba(51, 65, 85, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{ color: '#22d3ee', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>
          DriveMe Analytics
        </div>
        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>▸ Live Dashboard</div>
      </div>

      {/* Apps section */}
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            color: '#475569',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            paddingLeft: '8px',
            marginBottom: '4px',
          }}
        >
          Apps
        </div>
        {APPS.map((app) => {
          const active = isActive(app.href)
          return (
            <Link
              key={app.name}
              href={app.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 8px',
                borderRadius: '6px',
                marginBottom: '2px',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s',
                backgroundColor: active ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                border: active ? '1px solid rgba(34, 211, 238, 0.15)' : '1px solid transparent',
                color: active ? '#22d3ee' : '#94a3b8',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: app.dot,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1 }}>{app.name}</span>
              {app.soon && (
                <span
                  style={{
                    fontSize: '9px',
                    color: '#475569',
                    backgroundColor: 'rgba(71, 85, 105, 0.2)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    letterSpacing: '0.02em',
                  }}
                >
                  próx.
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Vistas section — only when payments active */}
      {isPaymentsActive && (
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              color: '#475569',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              paddingLeft: '8px',
              marginBottom: '4px',
            }}
          >
            Vistas
          </div>
          {PAYMENTS_VIEWS.map((view) => {
            const active = isActive(view.href)
            return (
              <Link
                key={view.name}
                href={view.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  marginBottom: '2px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'background 0.15s',
                  backgroundColor: active ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                  border: active ? '1px solid rgba(34, 211, 238, 0.15)' : '1px solid transparent',
                  color: active ? '#22d3ee' : '#64748b',
                }}
              >
                {view.name}
              </Link>
            )
          })}
        </div>
      )}
    </aside>
  )
}
