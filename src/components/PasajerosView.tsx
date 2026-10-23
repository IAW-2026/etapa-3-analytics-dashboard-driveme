'use client'

import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import type { Transaccion, User } from '@/lib/services/payments'
import { buildBarData, buildDonutMetodoPago, ensureArray, filterByDateRange } from '@/lib/filterUtils'

function formatPeso(v: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
}

const dateInputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '12px',
  colorScheme: 'dark',
  color: 'var(--color-text-primary)',
}

interface Props {
  riders: User[]
  transacciones: Transaccion[]
}

export default function PasajerosView({ riders: ridersProp, transacciones: transaccionesProp }: Props) {
  const riders = ensureArray<User>(ridersProp)
  const transacciones = ensureArray<Transaccion>(transaccionesProp)

  const [idInput, setIdInput] = useState('')
  const [idFilter, setIdFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setIdFilter(idInput.trim()), 200)
    return () => clearTimeout(t)
  }, [idInput])

  const filteredRiders = useMemo(
    () => idFilter ? riders.filter((r) => r.id.includes(idFilter)) : riders,
    [riders, idFilter],
  )

  const riderIds = useMemo(
    () => new Set(filteredRiders.map((r) => r.id)),
    [filteredRiders],
  )

  const filteredTransacciones = useMemo(() => {
    const byId = transacciones.filter((tx) => riderIds.has(tx.idPasajero))
    return filterByDateRange(byId, dateFrom, dateTo, (tx) => tx.fechaCreacion)
  }, [transacciones, riderIds, dateFrom, dateTo])

  // Financial calculations use only confirmed transactions — cancelled/pending don't represent real spending
  const confirmedTransacciones = useMemo(
    () => filteredTransacciones.filter((tx) => tx.estado === 'CONFIRMADO'),
    [filteredTransacciones],
  )

  const kpis = useMemo(() => {
    const totalGastado = confirmedTransacciones.reduce((s, tx) => s + Number(tx.monto), 0)
    const confirmedCount = confirmedTransacciones.length
    return {
      count: filteredRiders.length,
      totalGastado,
      txCount: filteredTransacciones.length, // all transactions (shows total activity)
      ticketPromedio: confirmedCount > 0 ? Math.round(totalGastado / confirmedCount) : 0,
    }
  }, [filteredRiders, filteredTransacciones, confirmedTransacciones])

  const barData = useMemo(
    () => buildBarData(confirmedTransacciones, dateFrom, dateTo, 'monto'),
    [confirmedTransacciones, dateFrom, dateTo],
  )
  const donutData = useMemo(
    () => buildDonutMetodoPago(confirmedTransacciones),
    [confirmedTransacciones],
  )

  // Per-rider stats for the table — O(riders + transacciones)
  const riderStats = useMemo(() => {
    const statsMap = new Map<string, { txCount: number; totalGastado: number; efectivo: number; mp: number }>()
    for (const r of filteredRiders) {
      statsMap.set(r.id, { txCount: 0, totalGastado: 0, efectivo: 0, mp: 0 })
    }
    for (const tx of filteredTransacciones) {
      const s = statsMap.get(tx.idPasajero)
      if (s) {
        s.txCount++ // count all transactions for activity metric
        if (tx.estado === 'CONFIRMADO') {
          s.totalGastado += Number(tx.monto) // only confirmed amounts
          if (tx.metodoPago === 'EFECTIVO') s.efectivo++
          else s.mp++
        }
      }
    }
    return filteredRiders.map((r) => {
      const s = statsMap.get(r.id)!
      return {
        id: r.id,
        txCount: s.txCount,
        totalGastado: s.totalGastado,
        metodoPredominante: s.efectivo >= s.mp ? 'EFECTIVO' : 'MERCADO PAGO',
      }
    })
  }, [filteredRiders, filteredTransacciones])

  const hasFilter = !!idInput || !!dateFrom || !!dateTo

  function clearFilters() {
    setIdInput('')
    setIdFilter('')
    setDateFrom('')
    setDateTo('')
  }

  function filterByPasajero(id: string) {
    setIdInput(id)
    setIdFilter(id)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="brutalist-card p-5">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="pasajeros-id" className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>PASAJERO</label>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <input
                id="pasajeros-id"
                type="text"
                className="brutalist-input font-mono"
                style={{ ...dateInputStyle, width: '220px', paddingRight: idInput ? '28px' : undefined }}
                placeholder="Filtrar por ID…"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
              />
              {idInput && (
                <button
                  onClick={() => setIdInput('')}
                  style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: 1, padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="pasajeros-desde" className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>DESDE</label>
            <input id="pasajeros-desde" type="date" className="brutalist-input" style={dateInputStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pasajeros-hasta" className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>HASTA</label>
            <input id="pasajeros-hasta" type="date" className="brutalist-input" style={dateInputStyle} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          {hasFilter && (
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px', backgroundColor: 'transparent',
                border: '1px solid rgba(220,38,38,0.3)', color: 'var(--color-text-secondary)',
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                borderRadius: 'var(--radius-button)', cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              Limpiar
            </button>
          )}
        </div>
        <div style={{ marginTop: '12px', color: 'var(--color-text-muted)', fontSize: '12px', letterSpacing: '0.03em' }}>
          {kpis.count} pasajero{kpis.count !== 1 ? 's' : ''} · {kpis.txCount} transacciones · {formatPeso(kpis.totalGastado)} gastado
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Pasajeros" value={kpis.count} accentColor="amber" />
        <KpiCard title="Total gastado" value={formatPeso(kpis.totalGastado)} accentColor="cyan" />
        <KpiCard title="Transacciones" value={kpis.txCount} accentColor="green" />
        <KpiCard title="Ticket promedio" value={kpis.txCount > 0 ? formatPeso(kpis.ticketPromedio) : '—'} accentColor="violet" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
        <div className="brutalist-card p-6">
          <div className="section-label mb-5 text-[11px]">Método de pago</div>
          <DonutChart data={donutData} height={180} />
        </div>
        <div className="brutalist-card p-6">
          <div className="section-label mb-5 text-[11px]">Gasto por día (ARS)</div>
          <BarChart data={barData} color="var(--color-info)" height={200} />
        </div>
      </div>

      {/* Riders table */}
      <div className="brutalist-card" style={{ overflow: 'hidden' }}>
        <div className="section-label" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(220,38,38,0.2)', fontSize: '11px' }}>
          Pasajeros — {kpis.count} en vista
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Pasajero', 'Transacciones', 'Total gastado', 'Método predominante'].map((h) => (
                  <th key={h} className="section-label" style={{ fontSize: '11px', textAlign: 'left', padding: '12px', borderBottom: '1px solid rgba(220,38,38,0.2)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riderStats.sort((a, b) => b.totalGastado - a.totalGastado).map((r) => (
                <tr key={r.id} className="hover:bg-red-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                        {r.id.slice(0, 8)}…
                      </span>
                      <button
                        onClick={() => filterByPasajero(r.id)}
                        title={r.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.4, transition: 'opacity 150ms' }}
                        className="hover:opacity-100"
                      >
                        <Filter size={11} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                    {r.txCount}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)', whiteSpace: 'nowrap' }}>
                    {r.totalGastado > 0 ? formatPeso(r.totalGastado) : '—'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {r.txCount > 0 ? (
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-input)',
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                        color: r.metodoPredominante === 'EFECTIVO' ? '#F87171' : '#60A5FA',
                        backgroundColor: r.metodoPredominante === 'EFECTIVO' ? 'rgba(220,38,38,0.12)' : 'rgba(59,130,246,0.12)',
                        border: r.metodoPredominante === 'EFECTIVO' ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(59,130,246,0.3)',
                      }}>
                        {r.metodoPredominante}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRiders.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    Sin resultados para el filtro aplicado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
