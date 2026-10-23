'use server'

import { getLiquidaciones } from '@/lib/services/payments'
import type { Liquidacion } from '@/lib/services/payments'

export async function fetchLiquidaciones(idConductor: string): Promise<Liquidacion[]> {
  return getLiquidaciones({ idConductor })
}
