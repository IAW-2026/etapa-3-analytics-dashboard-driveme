export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Topbar from '@/components/Topbar'
import TransaccionesFilter from '@/components/TransaccionesFilter'
import TransaccionesFullTable from '@/components/TransaccionesFullTable'
import { getTransacciones } from '@/lib/services/payments'

interface PageProps {
  searchParams: Promise<{
    estado?: string
    estadoLiquidacion?: string
    idPasajero?: string
    idConductor?: string
  }>
}

export default async function TransaccionesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const estado = params.estado as 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | undefined
  const estadoLiquidacion = params.estadoLiquidacion as 'PENDIENTE' | 'LIQUIDADO' | undefined
  const idPasajero = params.idPasajero
  const idConductor = params.idConductor

  const transacciones = await getTransacciones({ estado, estadoLiquidacion, idPasajero, idConductor })

  const activeFilters = [
    estado && `estado: ${estado}`,
    estadoLiquidacion && `liquidación: ${estadoLiquidacion}`,
    idPasajero && `pasajero: ${idPasajero.slice(0, 8)}…`,
    idConductor && `conductor: ${idConductor.slice(0, 8)}…`,
  ].filter(Boolean)

  return (
    <div className="pb-12">
      <Topbar title="Transacciones" subtitle="Fuente: Payments API — /api/pagos/transacciones" />

      <div className="flex flex-col gap-5 px-0 md:px-2">
        <Suspense fallback={null}>
          <TransaccionesFilter />
        </Suspense>

        <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', letterSpacing: '0.05em' }}>
          {transacciones.length} transacción{transacciones.length !== 1 ? 'es' : ''}
          {activeFilters.length > 0 && ` · ${activeFilters.join(' · ')}`}
        </div>

        <div className="brutalist-card" style={{ overflow: 'hidden' }}>
          <Suspense fallback={
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Cargando…
            </div>
          }>
            <TransaccionesFullTable transacciones={transacciones} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
