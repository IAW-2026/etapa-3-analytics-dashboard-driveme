# Investigación de bug — API Payments / Dashboard Analytics

**Fecha:** 2026-06-23  
**Repo afectado:** etapa-3-analytics-dashboard-driveme (dashboard Next.js)

---

## El error

```
Objects are not valid as a React child
(found: object with keys {mensaje, transacciones})
```

React recibe el objeto `{ mensaje: "...", transacciones: [...] }` donde debería
recibir un array de transacciones. El componente intenta iterar/renderizar el
array pero recibe el wrapper completo, lo que rompe la página en runtime.

El error ocurre **de forma intermitente** en la página de Conductores y a veces
en la página de Pasajeros. No siempre aparece — hay momentos en que funciona.

---

## Cómo llama el dashboard a la API

Todas las llamadas las hace desde un Server Component (Next.js 16, App Router).
El patrón es siempre el mismo:

```ts
const url = new URL('/api/pagos/transacciones', process.env.PAYMENTS_APP_URL)
// si hay query params, se agregan con url.searchParams.set(key, value)

const res = await fetch(url.toString(), {
  headers: { Authorization: `Bearer ${process.env.PAYMENTS_SERVICE_SECRET}` },
  cache: 'no-store',   // sin cache, siempre fresco
})
const data = await res.json()
```

Archivo: `src/lib/services/payments.ts`

---

## Endpoints que usa el dashboard

### 1. `GET /api/pagos/transacciones` — **EL PROBLEMÁTICO**

**Cuándo se llama:** al cargar las páginas de Conductores y Pasajeros.  
**Params:** ninguno (sin query string).

**Response que esperamos:**
```json
[
  {
    "id": "784fb3ae-...",
    "idViaje": "string",
    "idPasajero": "string",
    "idConductor": "string",
    "metodoPago": "EFECTIVO | MERCADO_PAGO",
    "monto": "1100",
    "estado": "PENDIENTE | CONFIRMADO | CANCELADO",
    "estadoLiquidacion": "PENDIENTE | LIQUIDADO",
    "fechaCreacion": "2026-06-18T...",
    "fechaActualizacion": "2026-06-18T..."
  }
]
```

Un array JSON plano.

**Response que recibimos (a veces):**
```json
{
  "mensaje": "Transacciones obtenidas correctamente",
  "transacciones": [
    { ... }
  ]
}
```

Un objeto con `mensaje` string y `transacciones` array.

**El problema:** la respuesta varía entre estas dos formas. No encontramos un
patrón claro de cuándo devuelve una u otra. Con `?idConductor=<id>` (al filtrar
desde la página de Transacciones) siempre devuelve el array plano y funciona bien.
Sin params, parece variar.

---

### 2. `GET /api/pagos/transacciones?idConductor=<id>`

**Cuándo se llama:** al filtrar en la página de Transacciones.  
**Response observada:** array plano — funciona bien.

---

### 3. `GET /api/pagos/admin/billeteras`

**Cuándo se llama:** al cargar la página de Conductores.  
**Params:** ninguno.

**Response esperada:**
```json
[
  {
    "id": "string",
    "idConductor": "string",
    "montoPendiente": 0,
    "montoLiquidado": 13275,
    "fechaActualizacion": "2026-06-20T..."
  }
]
```

**Observado:** a veces devuelve `{ "mensaje": "..." }` sin array. No queda claro
si es porque no hay datos o si es otro caso de envelope incompleto.

---

### 4. `GET /api/pagos/liquidaciones?idConductor=<id>`

**Cuándo se llama:** solo cuando el usuario filtra a exactamente un conductor.
Lo llamamos con server action para evitar llamarlo sin params.  
**Status:** funciona bien cuando se pasa `?idConductor=`.

**Sin `?idConductor=` (lo que hacíamos antes):**  
Devuelve `{ "mensaje": "Debe especificarse un conductor" }` sin datos.
Eso causaba otro error similar. Ya lo resolvimos: ahora nunca llamamos
este endpoint sin el param.

---

### 5. `GET /api/pagos/admin/banco-central`

**Cuándo se llama:** al cargar el Overview de Payments.  
**Status:** funciona sin problemas.

---

### 6. `GET /api/pagos/admin/users`

**Cuándo se llama:** al cargar las páginas de Conductores y Pasajeros (para
mapear IDs a roles).  
**Status:** funciona sin problemas aparentes.

---

## Defensas ya implementadas en el dashboard

Para que quede claro que el error no es de este lado del código:

1. **`toArray()` en el service** (`src/lib/services/payments.ts`):
   ```ts
   function toArray<T>(result: unknown): T[] {
     if (Array.isArray(result)) return result as T[]
     if (result && typeof result === 'object') {
       for (const val of Object.values(result)) {
         if (Array.isArray(val)) return val as T[]
       }
     }
     return []
   }
   ```
   Esta función extrae el array del envelope si existe.

2. **`ensureArray()` en client components** (`src/lib/filterUtils.ts`):
   Misma lógica, disponible en el lado cliente — se llama al inicio de cada
   componente que recibe arrays de props.

3. **`ensureArray()` en el server component (page)**:
   Antes de pasar los datos al client component, el page server component
   también normaliza:
   ```ts
   const billeteras = ensureArray<Billetera>(rawBilleteras)
   const transacciones = ensureArray<Transaccion>(rawTransacciones)
   ```

4. **`cache: 'no-store'`** en todos los `fetch()` — descartamos que sea cache
   de disco de Next.js sirviendo una respuesta vieja.

5. **`export const dynamic = 'force-dynamic'`** en todas las páginas de Payments
   — descartamos que el Router Cache del cliente sirva un RSC payload viejo.

6. **`experimental.staleTimes.dynamic: 0`** en `next.config.ts` — deshabilita
   el client-side Router Cache para páginas dinámicas.

7. **Borrado completo de `.next/`** y restart del servidor — descartamos
   compilación cacheada de Turbopack.

Aun así el error persiste de forma intermitente.

---

## Debug log agregado

En `getTransacciones` pusimos un log para observar el tipo de respuesta:

```ts
console.log('[getTransacciones] raw type:', Array.isArray(raw) ? 'array' : typeof raw,
  '| keys:', raw && typeof raw === 'object' && !Array.isArray(raw) ? Object.keys(raw) : 'n/a')
```

En una prueba que funcionó correctamente, el log mostró:
```
[getTransacciones] raw type: array | keys: n/a
```

El error aparece cuando la API devuelve el envelope y el log debería mostrar:
```
[getTransacciones] raw type: object | keys: mensaje,transacciones
```

---

## Preguntas para el backend

### Crítica (bloquea el dashboard)

> **¿`GET /api/pagos/transacciones` sin query params tiene un response shape fijo?**
>
> Vemos que a veces devuelve el array plano `[...]` y otras veces el envelope
> `{ "mensaje": "...", "transacciones": [...] }`.
> ¿Cuándo devuelve cada uno? ¿Hay alguna condición —estado del servidor, volumen
> de datos, flag de autenticación— que cambie el formato?

### Importantes

> **¿El envelope `{ mensaje, <resource> }` aparece en respuestas exitosas (2xx)?**
>
> ¿O solo aparece cuando hay un error o advertencia? El dashboard actualmente solo
> considera error cuando `res.ok === false`. Si el endpoint devuelve un 200 con
> el envelope, necesitamos saberlo para poder manejarlo correctamente.

> **¿Los arrays siempre vienen como array plano en status 200?**
>
> La pregunta más simple: ¿el contrato de la API garantiza que si hay datos,
> el status 200 devuelve siempre `[...]`? ¿O hay casos donde 200 + envelope
> es la respuesta "correcta"?

> **¿Cuál es el tipo de `monto` y `montoPagado` en el JSON?**
>
> El debug log muestra `"monto":"1000"` (string), pero la interfaz TypeScript
> los define como `number`. El dashboard ya aplica `Number(tx.monto)` para
> compensar, pero queremos saber si es intencional que sean strings.

### Baja prioridad

> **¿El estado canónico de liquidaciones es `"EJECUTADA"` o `"PROCESADA"`?**
>
> La interfaz TypeScript usa `"EJECUTADA"`, pero el debug log muestra
> `"estado":"PROCESADA"`. El dashboard ya maneja ambos, pero queremos
> saber cuál es el valor que devuelve realmente la API.

---

## Hipótesis más probable

El endpoint `GET /api/pagos/transacciones` tiene dos paths de código:
uno devuelve array plano (cuando hay query params o alguna otra condición),
otro devuelve el envelope. Cuando el dashboard llama sin params, cae en el
path que devuelve el envelope. Aunque el dashboard tiene múltiples capas de
normalización (`toArray` → `ensureArray` en page → `ensureArray` en component),
en algún punto la referencia al objeto completo llega a React antes de ser
normalizada — posiblemente por cómo Next.js serializa y re-hidrata el RSC payload.
