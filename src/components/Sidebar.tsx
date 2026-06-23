'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Badge, Crosshair, Route, ShieldAlert, ChevronRight, MapPinned } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

const APPS = [
  { name: 'Payments', href: '/payments', icon: Badge, soon: false },
  { name: 'Driver', href: '/driver', icon: Crosshair, soon: false },
  { name: 'Rider', href: '/rider', icon: Route, soon: true },
  { name: 'Feedback', href: '/feedback', icon: ShieldAlert, soon: true },
]

const PAYMENTS_VIEWS = [
  { name: 'Overview', href: '/payments', icon: MapPinned },
  { name: 'Transacciones', href: '/payments/transacciones', icon: ChevronRight },
  { name: 'Conductores', href: '/payments/conductores', icon: ChevronRight },
  { name: 'Pasajeros', href: '/payments/pasajeros', icon: ChevronRight },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isPaymentsActive = pathname.startsWith('/payments')

  function isActive(href: string) {
    if (href === '/payments') return pathname === '/payments'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 60,
          padding: '8px',
          borderRadius: 'var(--radius-button)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid rgba(220, 38, 38, 0.15)',
        }}
        className="md:hidden flex items-center justify-center shadow-lg"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden"
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(5,5,5,0.8)', zIndex: 40, backdropFilter: 'blur(4px)'
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '240px',
          minWidth: '240px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid rgba(220, 38, 38, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 50,
          transition: 'transform 0.3s ease-in-out',
          boxShadow: '2px 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '32px', paddingLeft: '8px' }} className="mt-12 md:mt-0">
          <div className="font-michroma" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            DriveMe
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>▸ Tactical Command</div>
        </div>

      {/* Apps section */}
      <div style={{ marginBottom: '16px' }}>
        <div className="section-label" style={{ fontSize: '10px', paddingLeft: '8px', marginBottom: '8px' }}>
          Apps
        </div>
        {APPS.map((app) => {
          const active = isActive(app.href)
          const Icon = app.icon
          return (
            <Link
              key={app.name}
              href={app.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-button)',
                marginBottom: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.15s ease-in-out',
                backgroundColor: active ? 'rgba(220, 38, 38, 0.08)' : 'transparent',
                border: active ? '1px solid rgba(220, 38, 38, 0.2)' : '1px solid transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: active ? '0 0 15px rgba(220, 38, 38, 0.1)' : 'none'
              }}
            >
              <Icon size={16} />
              <span style={{ flex: 1, fontWeight: active ? 500 : 400 }}>{app.name}</span>
              {app.soon && (
                <span
                  style={{
                    fontSize: '9px',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
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
          <div className="section-label" style={{ fontSize: '10px', paddingLeft: '8px', marginBottom: '8px' }}>
            Vistas
          </div>
          {PAYMENTS_VIEWS.map((view) => {
            const active = isActive(view.href)
            const Icon = view.icon
            return (
              <Link
                key={view.name}
                href={view.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-button)',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'all 0.15s ease-in-out',
                  backgroundColor: active ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                  border: active ? '1px solid rgba(220, 38, 38, 0.1)' : '1px solid transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                <Icon size={14} />
                <span>{view.name}</span>
              </Link>
            )
          })}
        </div>
      )}

        {/* User footer */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid rgba(220,38,38,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <UserButton appearance={{
              elements: {
                avatarBox: { width: '32px', height: '32px', borderRadius: '4px', border: '1px solid rgba(220,38,38,0.3)', boxShadow: '0 0 10px rgba(220,38,38,0.1)' },
                userButtonPopoverCard: { backgroundColor: '#0A0A0A', border: '1px solid rgba(220,38,38,0.15)', boxShadow: '0 0 30px rgba(220,38,38,0.1)' },
                userButtonPopoverActionButton: { color: 'var(--color-text-secondary)' },
                userButtonPopoverFooter: { display: 'none' },
              },
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ color: 'var(--color-text-primary)', fontSize: '11px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? '—'}
              </span>
              <span className="font-michroma" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(220,38,38,0.6)' }}>Admin</span>
            </div>
          </div>
          <p className="font-michroma" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(220,38,38,0.3)', margin: 0 }}>
            DriveMe // v1.0
          </p>
        </div>
    </aside>
    </>
  )
}
