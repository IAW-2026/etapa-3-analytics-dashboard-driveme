'use client'

import { SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Crosshair } from 'lucide-react'

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '360px',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid rgba(220,38,38,0.15)',
  borderRadius: 'var(--radius-card)',
  boxShadow: '0 0 40px rgba(220,38,38,0.05)',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
}

const divider: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(220,38,38,0.15)',
}

const iconBox: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  border: '1px solid var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(220,38,38,0.05)',
  boxShadow: '0 0 15px rgba(220,38,38,0.2)',
}

function Logo({ subtitle }: { subtitle: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={iconBox}>
        <Crosshair size={20} color="var(--color-primary)" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-michroma" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          DriveMe Analytics
        </h1>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(220,38,38,0.6)', marginTop: '4px' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export function UnauthenticatedCard() {
  return (
    <div style={card}>
      <Logo subtitle="Panel de administración" />
      <div style={divider} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <SignInButton>
          <button className="landing-btn-primary">Iniciar sesión</button>
        </SignInButton>
        <SignUpButton>
          <button className="landing-btn-secondary">Registrarse</button>
        </SignUpButton>
      </div>
    </div>
  )
}

export function AccessDeniedCard({ displayName, email }: { displayName: string; email?: string }) {
  return (
    <div style={card}>
      <Logo subtitle="Acceso restringido" />
      <div style={divider} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
        <UserButton appearance={{
          elements: {
            avatarBox: 'w-9 h-9',
            userButtonPopoverCard: 'bg-[#0A0A0A] border border-[rgba(220,38,38,0.15)]',
            userButtonPopoverFooter: 'hidden',
          },
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ color: 'var(--color-text-primary)', fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
          {email && <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>}
        </div>
      </div>
      <div style={divider} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
        <div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>Tu cuenta no tiene permisos de administrador.</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>Contactá al equipo para solicitar acceso.</p>
        </div>
        <SignOutButton>
          <button className="landing-btn-secondary" style={{ width: '100%' }}>Cerrar sesión</button>
        </SignOutButton>
      </div>
    </div>
  )
}
