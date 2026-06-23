'use client'

import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import DonutChart from '@/components/DonutChart'
import type { Billetera, Liquidacion, Transaccion } from '@/lib/services/payments'
import { buildBarData, buildDonutMetodoPago, ensureArray, filterByDateRange } from '@/lib/filterUtils'
import { fetchLiquidaciones } from '@/lib/actions'

function formatPeso(v: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  } catch { return '—' }
}

const dateInputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '12px',
  colorScheme: 'dark',
  color: 'var(--color-text-primary)',
}

interface Props {
  billeteras: Billetera[]
  transacciones: Transaccion[]
}

export default function ConductoresView({ billeteras: billeterasProp, transacciones: transaccionesProp }: Props) {
  const billeteras = ensureArray<Billetera>(billeterasProp)
  const transacciones = ensureArray<Transaccion>(transaccionesProp)

  const [idInput, setIdInput] = useState('')
  const [idFilter, setIdFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([])
  const [liqLoading, setLiqLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIdFilter(idInput.trim()), 200)
    return () => clearTimeout(t)
  }, [idInput])

  const filteredBilleteras = useMemo(
    () => idFilter ? billeteras.filter((b) => b.idConductor.includes(idFilter)) : billeteras,
    [billeteras, idFilter],
  )

  const conductorIds = useMemo(
    () => new Set(filteredBilleteras.map((b) => b.idConductor)),
    [filteredBilleteras],
  )

  const filteredTransacciones = useMemo(() => {
    const byId = transacciones.filter((tx) => conductorIds.has(tx.idConductor))
    return filterByDateRange(byId, dateFrom, dateTo, (tx) => tx.fechaCreacion)
  }, [transacciones, conductorIds, dateFrom, dateTo])

  // Fetch liquidaciones lazily — only when exactly one conductor is selected
  const selectedConductorId = filteredBilleteras.length === 1 ? filteredBilleteras[0].idConductor : null

  useEffect(() => {
    if (!selectedConductorId) {
      setLiquidaciones([])
      return
    }
    let cancelled = false
    setLiqLoading(true)
    fetchLiquidaciones(selectedConductorId).then((data) => {
      if (!cancelled) {
        setLiquidaciones(ensureArray<Liquidacion>(data))
        setLiqLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [selectedConductorId])

  const filteredLiquidaciones = useMemo(
    () => filterByDateRange(liquidaciones, dateFrom, dateTo, (l) => l.fechaCreacion),
    [liquidaciones, dateFrom, dateTo],
  )

  const kpis = useMemo(() => ({
    count: filteredBilleteras.length,
    totalLiquidado: filteredBilleteras.reduce((s, b) => s + Number(b.montoLiquidado), 0),
    totalPendiente: filteredBilleteras.reduce((s, b) => s + Number(b.montoPendiente), 0),
    txCount: filteredTransacciones.length,
  }), [filteredBilleteras, filteredTransacciones])

  const barData = useMemo(
    () => buildBarData(filteredTransacciones, dateFrom, dateTo, 'count'),
    [filteredTransacciones, dateFrom, dateTo],
  )
  const donutData = useMemo(
    () => buildDonutMetodoPago(filteredTransacciones),
    [filteredTransacciones],
  )

  const hasFilter = !!idInput || !!dateFrom || !!dateTo

  function clearFilters() {
    setIdInput('')
    setIdFilter('')
    setDateFrom('')
    setDateTo('')
  }

  function filterByConductor(id: string) {
    setIdInput(id)
    setIdFilter(id)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="brutalist-card p-5">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>CONDUCTOR</label>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <input
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
            <label className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>DESDE</label>
            <input type="date" className="brutalist-input" style={dateInputStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="section-label" style={{ fontSize: '10px', display: 'block', marginBottom: '6px' }}>HASTA</label>
            <input type="date" className="brutalist-input" style={dateInputStyle} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
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
          {kpis.count} conductor{kpis.count !== 1 ? 'es' : ''} · {kpis.txCount} transacciones · {formatPeso(kpis.totalLiquidado)} liquidado
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Conductores" value={kpis.count} accentColor="amber" />
        <KpiCard title="Total liquidado" value={formatPeso(kpis.totalLiquidado)} accentColor="cyan" />
        <KpiCard title="Total pendiente" value={formatPeso(kpis.totalPendiente)} accentColor="violet" />
        <KpiCard title="Transacciones" value={kpis.txCount} accentColor="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="brutalist-card p-6">
          <div className="section-label mb-5 text-[11px]">Transacciones por día</div>
          <BarChart data={barData} color="var(--color-primary)" height={200} />
        </div>
        <div className="brutalist-card p-6">
          <div className="section-label mb-5 text-[11px]">Método de pago</div>
          <DonutChart data={donutData} height={180} />
        </div>
      </div>

      {/* Billeteras table */}
      <div className="brutalist-card" style={{ overflow: 'hidden' }}>
        <div className="section-label" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(220,38,38,0.2)', fontSize: '11px' }}>
          Billeteras — {kpis.count} conductor{kpis.count !== 1 ? 'es' : ''}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Conductor', 'Liquidado', 'Pendiente'].map((h) => (
                  <th key={h} className="section-label" style={{ fontSize: '11px', textAlign: 'left', padding: '12px', borderBottom: '1px solid rgba(220,38,38,0.2)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBilleteras.map((b) => (
                <tr key={b.id} className="hover:bg-red-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px', fontFamily: 'var(--font-geist-mono, monospace)' }}>
                        {b.idConductor.slice(0, 8)}…
                      </span>
                      <button
                        onClick={() => filterByConductor(b.idConductor)}
                        title={b.idConductor}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.4, transition: 'opacity 150ms' }}
                        className="hover:opacity-100"
                      >
                        <Filter size={11} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)', whiteSpace: 'nowrap' }}>
                    {formatPeso(Number(b.montoLiquidado))}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-primary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)', whiteSpace: 'nowrap', textShadow: '0 0 10px rgba(220,38,38,0.4)' }}>
                    {formatPeso(Number(b.montoPendiente))}
                  </td>
                </tr>
              ))}
              {filteredBilleteras.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    Sin resultados para el filtro aplicado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liquidaciones — single conductor only, loaded on demand */}
      {selectedConductorId && (
        <div className="brutalist-card" style={{ overflow: 'hidden' }}>
          <div className="section-label" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(220,38,38,0.2)', fontSize: '11px' }}>
            Historial de liquidaciones — {selectedConductorId.slice(0, 8)}…
          </div>
          {liqLoading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Cargando…
            </div>
          ) : filteredLiquidaciones.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Sin liquidaciones en el período
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Fecha programada', 'Fecha ejecutada', 'Monto', 'Estado', 'Detalle'].map((h) => (
                      <th key={h} className="section-label" style={{ fontSize: '11px', textAlign: 'left', padding: '12px', borderBottom: '1px solid rgba(220,38,38,0.2)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLiquidaciones.map((l) => (
                    <tr key={l.id} className="hover:bg-red-900/10 transition-colors" style={{ borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
                      <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>{formatDate(l.fechaProgramada)}</td>
                      <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>{l.fechaEjecutada ? formatDate(l.fechaEjecutada) : '—'}</td>
                      <td style={{ padding: '12px', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-geist-mono, monospace)', whiteSpace: 'nowrap' }}>{formatPeso(Number(l.montoPagado))}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--radius-input)',
                          fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                          color: l.estado === 'EJECUTADA' || l.estado === 'PROCESADA' ? 'var(--color-success)' : 'var(--color-warning)',
                          backgroundColor: l.estado === 'EJECUTADA' || l.estado === 'PROCESADA' ? 'rgba(5,150,105,0.15)' : 'rgba(217,119,6,0.15)',
                          border: l.estado === 'EJECUTADA' || l.estado === 'PROCESADA' ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(217,119,6,0.3)',
                        }}>
                          {l.estado}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.detalle || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}
