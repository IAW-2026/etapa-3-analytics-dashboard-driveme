# Clerk Authentication — Design Spec
**Date:** 2026-06-23
**Project:** DriveMe Analytics Dashboard (IAW 2026 Etapa 3)

## Goal

Replace the current HTTP Basic Auth gate (`CONTROL_PLANE_PASSWORD`) with Clerk-based authentication. Access is restricted to users with `publicMetadata.role === "admin"` in Clerk.

---

## Architecture

### Route structure

All protected pages move into a `(app)` route group. This separates the sidebar shell from public auth pages without changing any URLs.

```
src/app/
  layout.tsx                    ← ClerkProvider only, no sidebar
  page.tsx                      ← Landing card (3 states)
  unauthorized/page.tsx         ← Fallback for non-admin authenticated users
  (app)/
    layout.tsx                  ← Sidebar shell (protected routes only)
    payments/page.tsx
    payments/transacciones/page.tsx
    payments/conductores/page.tsx
    driver/page.tsx
    rider/page.tsx
    feedback/page.tsx
```

### Public routes (no auth required)
- `/`
- `/unauthorized`
- `/api/webhooks/*`

### Protected routes (admin only)
Everything else — enforced by middleware.

---

## Files Changed

| File | Action | Description |
|---|---|---|
| `src/proxy.ts` | Modify | Replace Basic Auth with Clerk middleware + admin role check |
| `src/lib/auth.ts` | Create | Re-exports `auth`, `currentUser`, `clerkClient` from `@clerk/nextjs/server` |
| `src/app/layout.tsx` | Modify | Add `<ClerkProvider>`, remove `<Sidebar>` |
| `src/app/(app)/layout.tsx` | Create | Layout with `<Sidebar>` for protected routes |
| `src/app/page.tsx` | Modify | Clerk landing card (3 states) |
| `src/app/unauthorized/page.tsx` | Create | Non-admin fallback page |
| `src/components/Sidebar.tsx` | Modify | Add `<UserButton>` + user info in footer |
| `src/app/(app)/payments/**` | Move | From `src/app/payments/**` |
| `src/app/(app)/driver/` | Move | From `src/app/driver/` |
| `src/app/(app)/rider/` | Move | From `src/app/rider/` |
| `src/app/(app)/feedback/` | Move | From `src/app/feedback/` |
| `.env.local` | Modify | Add Clerk keys (already done) |

---

## Middleware (`src/proxy.ts`)

```
Public route? → pass through
       ↓
auth.protect() → no session → Clerk redirects to sign-in
       ↓
fetch user from Clerk API
       ↓
publicMetadata.role === "admin"? → no → redirect to /unauthorized
       ↓
pass through
```

Matcher covers all routes except `_next` static assets; includes `/__clerk/(.*)`.

---

## Homepage (`src/app/page.tsx`)

Server component with three states:

1. **No session** — card with `Crosshair` icon (lucide-react, already in project), DriveMe title, "Panel de administración" subtitle, Sign In + Sign Up buttons
2. **Session + admin role** — `redirect('/payments')` (same as current behavior)
3. **Session + no admin role** — same card with `<UserButton>`, user name/email, "no tenés permisos" message, Sign Out button

Card styling matches existing project conventions:
- `background: var(--color-surface)` (`#0A0A0A`)
- `border: 1px solid rgba(220,38,38,0.15)`
- `borderRadius: var(--radius-card)` (8px)
- Buttons use `var(--color-primary)` for primary action

---

## Sidebar Footer

New section added at the bottom of `<Sidebar>`:
- `<UserButton>` styled with Clerk appearance override (dark theme, red accent borders)
- User full name (fallback: primary email address)
- "Admin" label in Michroma font / uppercase / muted red
- "DriveMe // v1.0" caption

Uses `useUser()` hook (component is already `'use client'`).

---

## ENV vars

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   ← already added
CLERK_SECRET_KEY=sk_test_...                    ← already added
```

`CONTROL_PLANE_PASSWORD` can be removed after Clerk is live and verified.

---

## Out of scope

- Clerk Organizations feature (disable in Clerk Dashboard)
- Webhook endpoint (`/api/webhooks/*`) — listed as public route but not implemented here
- Any writes to the DriveMe API (dashboard remains read-only)
- Role assignment UI — admin role must be set manually in Clerk Dashboard → Users → Metadata → Public: `{"role":"admin"}`
