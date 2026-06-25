[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/l2PpCgMp)
# DriveMe — Analytics Dashboard

Dashboard interno para monitorear las métricas operativas de la plataforma DriveMe. Consolida datos de cuatro microservicios: **Payments**, **Driver**, **Rider** y **Feedback**.

Aplicación del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — Etapa 3.

**Deploy:** https://etapa-3-analytics-dashboard-driveme.vercel.app

---

## Acceso

El acceso está gestionado con **Clerk**. Solo los usuarios con el rol `admin` configurado en sus metadatos pueden usar el dashboard.

| Tipo de usuario | Cómo acceder |
|---|---|
| **Administrador** | Iniciá sesión con una cuenta de Clerk que tenga `publicMetadata.role = "admin"`. Tenés acceso completo al dashboard. |
| **Usuario sin permisos** | Al iniciar sesión, la app redirige a `/unauthorized`. No hay acceso al contenido. |

Para asignar el rol admin a un usuario, entrá al [Clerk Dashboard](https://dashboard.clerk.com), buscá el usuario y editá su `publicMetadata`:

```json
{ "role": "admin" }
```

---

## Setup local

1. Copiá `.env.local.example` a `.env.local` y completá los valores.
2. Instalá dependencias: `npm install`
3. Levantá el servidor: `npm run dev`