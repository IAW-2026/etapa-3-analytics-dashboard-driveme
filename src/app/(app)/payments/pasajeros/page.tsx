export const dynamic = 'force-dynamic'

import Topbar from '@/components/Topbar'
import PasajerosView from '@/components/PasajerosView'
import { getUsers, getTransacciones } from '@/lib/services/payments'

export default async function PasajerosPage() {
  const [users, transacciones] = await Promise.all([
    getUsers(),
    getTransacciones(),
  ])

  const riders = users.filter((u) => u.rol === 'RIDER')

  return (
    <div className="pb-12">
      <Topbar title="Pasajeros" subtitle="Fuente: Payments API — /api/pagos/admin/users" />
      <div className="flex flex-col gap-6 px-0 md:px-2">
        <PasajerosView riders={riders} transacciones={transacciones} />
      </div>
    </div>
  )
}
