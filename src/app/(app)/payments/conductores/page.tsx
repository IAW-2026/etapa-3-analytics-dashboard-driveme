export const dynamic = 'force-dynamic'

import Topbar from '@/components/Topbar'
import ConductoresView from '@/components/ConductoresView'
import { getBilleteras, getTransacciones } from '@/lib/services/payments'
import { ensureArray } from '@/lib/filterUtils'
import type { Billetera, Transaccion } from '@/lib/services/payments'

export default async function ConductoresPage() {
  const [rawBilleteras, rawTransacciones] = await Promise.all([
    getBilleteras(),
    getTransacciones(),
  ])

  const billeteras = ensureArray<Billetera>(rawBilleteras)
  const transacciones = ensureArray<Transaccion>(rawTransacciones)

  return (
    <div className="pb-12">
      <Topbar title="Conductores" subtitle="Fuente: Payments API — /api/pagos/admin/billeteras" />
      <div className="flex flex-col gap-6 px-0 md:px-2">
        <ConductoresView
          billeteras={billeteras}
          transacciones={transacciones}
        />
      </div>
    </div>
  )
}
