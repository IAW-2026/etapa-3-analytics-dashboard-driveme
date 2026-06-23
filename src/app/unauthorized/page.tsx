import Link from 'next/link'
import { Crosshair } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '4px',
        border: '1px solid var(--color-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(220,38,38,0.05)',
        boxShadow: '0 0 15px rgba(220,38,38,0.2)',
      }}>
        <Crosshair size={20} color="var(--color-primary)" />
      </div>
      <h1 className="font-michroma" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
        Acceso denegado
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>
        No tenés permisos para acceder a esta aplicación.
      </p>
      <Link href="/" style={{
        color: 'var(--color-primary)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textDecoration: 'none',
        transition: 'opacity 150ms ease-in-out',
      }}>
        Volver al inicio
      </Link>
    </div>
  )
}
