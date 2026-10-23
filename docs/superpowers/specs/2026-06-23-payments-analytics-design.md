# Payments Analytics Expansion — Design Spec
**Date:** 2026-06-23
**Project:** DriveMe Analytics Dashboard (IAW 2026 Etapa 3)

## Goal

Expand the Payments section with reactive filtering and per-entity analytics across three pages: Transacciones (enhanced), Conductores (overhauled), and Pasajeros (new). All filtering is client-side on server-pre-fetched data — zero extra API calls on filter change.

---

## Shared Architecture Pattern

```
Server page component
  → fetches all needed data in parallel (Promise.all)
  → passes raw arrays as props to a 'use client' wrapper component
       → owns: idFilter (string), dateFrom (string), dateTo (string)
       → derives: KPIs, chart data, table rows via useMemo
       → renders: filter bar + summary line + KPI cards + charts + table
```

- ID filter: substring match on full ID (not truncated display)
- Date filter: client-side comparison on `fechaCreacion` field (ISO string startsWith date prefix)
- "Limpiar" button appears only when any filter is active, resets all to empty string
- All inputs debounced 200ms to avoid jank on fast typing

---

## 1 — Transacciones Page (Enhancement)

### What changes
- `TransaccionesFilter.tsx` — add two text inputs: `idPasajero` and `idConductor`
- `page.tsx` — read new searchParams, pass to `getTransacciones({ idPasajero, idConductor, estado, estadoLiquidacion })`
- Table rows — Pasajero and Conductor cells get a `<FilterIcon>` button (lucide-react `Filter`, 12px) that calls `router.push()` with the full ID pre-filled in the corresponding URL param

### Filter behavior
All four filters (estado, estadoLiquidacion, idPasajero, idConductor) are server-side via URL searchParams. The API accepts all four. Filter icon in a table row sets that param to the full ID (not truncated), triggering a server re-render with the exact match.

### Table extraction
`TransaccionesGrid` (currently an inline server function in `page.tsx`) is extracted to a `'use client'` component so it can use `useRouter` for the click-to-filter buttons. It receives `transacciones` as a prop from the server page.

### Files
| File | Action |
|---|---|
| `src/components/TransaccionesFilter.tsx` | Add idPasajero + idConductor text inputs + router.push on change |
| `src/app/(app)/payments/transacciones/page.tsx` | Pass idPasajero + idConductor from searchParams to getTransacciones; render extracted table component |
| `src/components/TransaccionesTable.tsx` | New — extracted 'use client' table with click-to-filter icon per ID cell |

> Note: existing `src/components/TransaccionesTable.tsx` is a different component (used in overview). The new one is specifically for the transacciones page with click-to-filter. Name it `TransaccionesFullTable.tsx` to avoid collision.

---

## 2 — Conductores Page (Overhaul)

### Server layer
Fetches in parallel:
```ts
const [billeteras, transacciones, liquidaciones] = await Promise.all([
  getBilleteras(),
  getTransacciones(),
  getLiquidaciones(),
])
```
Passes all three to `<ConductoresView>` client wrapper.

### ConductoresView client component
**State:** `idFilter: string`, `dateFrom: string`, `dateTo: string`

**Derived (useMemo):**
- `filteredBilleteras` — billeteras where `idConductor.includes(idFilter.trim())`
- `conductorIds` — Set of idConductor from filteredBilleteras
- `filteredTransacciones` — transacciones where `conductorIds.has(idConductor)` AND fechaCreacion within [dateFrom, dateTo]
- `filteredLiquidaciones` — liquidaciones where `conductorIds.has(idConductor)` AND fechaProgramada within [dateFrom, dateTo]
- `kpis` — { count, totalLiquidado, totalPendiente, txCount }
- `barData` — tx count per day from filteredTransacciones (last 14 days if no date filter, else full range)
- `donutData` — EFECTIVO vs MERCADO_PAGO counts from filteredTransacciones

**Renders:**
1. Filter bar: ID text input + dateFrom + dateTo + Limpiar button (when active)
2. Summary line: `{count} conductores · {txCount} transacciones · {totalLiquidado} liquidado`
3. KPI row (4 cards): Conductores en vista · Total liquidado · Total pendiente · Transacciones
4. Charts row: BarChart (tx volume over time) + DonutChart (método de pago)
5. Billeteras table: filtered rows, each with click-to-filter icon on the ID cell
6. **Liquidaciones section** (conditional — only when `filteredBilleteras.length === 1`):
   - Section label: "Historial de liquidaciones — {conductorId}"
   - Table: fecha programada · fecha ejecutada · monto · estado · detalle

### Files
| File | Action |
|---|---|
| `src/app/(app)/payments/conductores/page.tsx` | Fetch billeteras + transacciones + liquidaciones; render ConductoresView |
| `src/components/ConductoresView.tsx` | New 'use client' wrapper with all filter logic |

---

## 3 — Pasajeros Page (New)

### Server layer
```ts
const [users, transacciones] = await Promise.all([
  getUsers(),
  getTransacciones(),
])
const riders = users.filter(u => u.rol === 'RIDER')
```
Passes `riders` and `transacciones` to `<PasajerosView>` client wrapper.

### PasajerosView client component
**State:** `idFilter: string`, `dateFrom: string`, `dateTo: string`

**Derived (useMemo):**
- `filteredRiders` — riders where `id.includes(idFilter.trim())`
- `riderIds` — Set of ids from filteredRiders
- `filteredTransacciones` — transacciones where `riderIds.has(idPasajero)` AND fechaCreacion within [dateFrom, dateTo]
- `riderStats` — Map<id, { txCount, totalGastado, metodoPredominante }>
  - metodoPredominante: whichever of EFECTIVO/MERCADO_PAGO appears more in their transactions
- `kpis` — { count, totalGastado, txCount, ticketPromedio: totalGastado / txCount }
- `barData` — spending per day (sum of monto by fechaCreacion day)
- `donutData` — EFECTIVO vs MERCADO_PAGO from filteredTransacciones

**Renders:**
1. Filter bar: ID text input + dateFrom + dateTo + Limpiar button (when active)
2. Summary line: `{count} pasajeros · {txCount} transacciones · {totalGastado} gastado`
3. KPI row (4 cards): Pasajeros en vista · Total gastado · Transacciones · Ticket promedio
4. Charts row: DonutChart (método de pago) + BarChart (gasto por día)
5. Riders table: one row per rider — ID (truncated, with click-to-filter icon) · Transacciones · Total gastado · Método predominante

### Files
| File | Action |
|---|---|
| `src/app/(app)/payments/pasajeros/page.tsx` | New server page |
| `src/components/PasajerosView.tsx` | New 'use client' wrapper |

---

## 4 — Sidebar

Add `Pasajeros` entry to `PAYMENTS_VIEWS` in `src/components/Sidebar.tsx`:
```ts
{ name: 'Pasajeros', href: '/payments/pasajeros', icon: ChevronRight }
```

---

## Reusable helpers

Both `ConductoresView` and `PasajerosView` share identical filter logic. Extract:
- `src/lib/filterUtils.ts` — pure functions:
  - `filterByDateRange(items, dateFrom, dateTo, getDate)` — filters any array by date field
  - `buildBarData(transacciones, dateFrom, dateTo)` — groups tx count or sum by day
  - `buildDonutMetodoPago(transacciones)` — returns EFECTIVO/MERCADO_PAGO counts

---

## Performance notes

- Data fetched once server-side, no re-fetch on filter change (Approach A)
- `useMemo` dependencies are the raw arrays + filter strings — derived data only recomputes when inputs change
- 200ms debounce on text inputs prevents recalculation on every keystroke
- Charts (recharts) receive derived data as plain arrays — no internal data fetching
- Tables are plain HTML tables with no virtualisation (acceptable for admin dashboard with bounded dataset sizes)

---

## Out of scope

- Server-side date filtering (API does not support date params)
- Group multi-select (replaced by substring filter that naturally matches multiple when left partial)
- Export to CSV / copy to clipboard
- Pagination on tables (all rows rendered; dataset size is bounded by the DriveMe user base)
