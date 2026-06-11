# AGENTS.md — SASL Frontend

## Stack

- Next.js 16.2.4, React 19.2.4, TypeScript 5
- Tailwind CSS v4 (no config, uses `@import "tailwindcss"` + `@theme` in `src/app/globals.css`)
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- PostCSS via `@tailwindcss/postcss` only
- ESLint 9 (`next/core-web-vitals` + `next/typescript`)

## Commands

| Command | Script |
|---------|--------|
| `npm run dev` | next dev |
| `npm run build` | next build |
| `npm run start` | next start |
| `npm run lint` | eslint |

## Path alias

`@/*` → `./src/*`

## Architecture

```
src/
├── app/
│   ├── Administrador/   # Dashboard admin (sidebar + 10 módulos)
│   │   ├── layout.tsx   # Server Component shell (Sidebar + Header as client)
│   │   ├── page.tsx     # Dashboard con tarjetas de resumen (6 llamadas API)
│   │   ├── components/  # Sidebar, Header, TablaGenerica, TarjetaResumen, estados
│   │   ├── usuarios/    # Full CRUD interactive
│   │   ├── servicios/   # Full CRUD interactive (tabs, asignaciones, terminados)
│   │   ├── maquinaria/  # Full CRUD interactive (detail + create)
│   │   ├── productos/   # Full CRUD interactive (crear + editar nombre/desc)
│   │   ├── proveedores/ # Full CRUD interactive (detail + crear + teléfono + editar nombre)
│   │   ├── reportes/    # Incidentes (interactive), Memorandums (crear+PDF), Memorandums (listar), Estado Maquinaria (interactive+CSV)
│   │   ├── cobros/      # Full CRUD interactive (detail + pagos + QRs)
│   │   └── catalogos/   # GET /Api/Catalogos/{nombre} — 17 catálogos (read-only)
│   ├── login/           # 2FA flow (credenciales → doble-factor)
│   │   ├── components/  # 4 client components
│   │   └── hooks/       # useAutenticacion.ts
│   ├── layout.tsx       # Root layout (Outfit + DM Sans via next/font)
│   ├── page.tsx         # Landing page
│   └── globals.css      # Tailwind @theme + custom classes (navbar, hero, login, etc.)
├── components/          # Atomic design (atoms/, molecules/, organisms/)
├── lib/api/             # Capa de servicios API
│   ├── client.ts        # fetch wrapper (peticion/peticionBinaria/peticionFormData)
│   ├── types.ts         # TypeScript interfaces (~76 types)
│   ├── *.service.ts     # One per module (12 services, ~71 endpoints)
└── middleware.ts        # src/middleware.ts — JWT role redirect
```

## Critical Inconsistency

- **Login hook inconsistency**: `useAutenticacion.ts` **hardcodes** `http://localhost:5112` and does NOT use `NEXT_PUBLIC_API_URL` env var like the rest of the codebase.

## Known Backend API Mismatches

Full spec: `doc-api/openapi.yaml` (base `http://localhost:5112`, auth cookie `token_sesion`).

| Aspect | Backend Expects | Frontend Sends |
|--------|----------------|----------------|
| Cookie name | `token_sesion` | `token_sesion` ✓ |
| `solicitar-2fa` body | `{ correo, password }` | `{ usuario, contraseña }` |
| `verificar-2fa` body | `{ email, codigoIngresado }` | `{ email, codigoIngresado }` ✓ |
| `verificar-2fa` response | `{ mensaje }` | Ignored, redirects to `/Administrador` |

## Middleware (`src/middleware.ts`)

- Reads JWT from cookie `token_sesion` (decodes base64 payload, no library)
- Role claim: `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` (ASP.NET)
- Authenticated `/login` → redirect to `/Administrador`
- Invalid/missing token on protected path → redirect to `/login`
- Matcher: `/Administrador/:path*`, `/login/auth`

## Design Tokens

Navy palette (`--color-navy-50`–`900`) and chuxna green defined via `@theme` in CSS. Duplicated as CSS custom properties in `:root` — some components reference CSS vars directly.

## Fonts

- Outfit (display) — `var(--font-outfit)`
- DM Sans (body) — `var(--font-dm-sans)`
- Login layout loads Inter locally via `next/font/google`

## Notable

- No `.env` file committed (all `.env*` gitignored)
- Component naming, comments, and identifiers: **Spanish throughout**
- Role pages: `Administrador/` is built. `/gerente`, `/trabajador`, `/cliente` not implemented yet
- Client login 2FA endpoints exist but are not consumed in frontend
- WebSocket at `/ws` exists in API but is not consumed
- **WSL 1 environment** — `npm`/`node` commands cannot execute. All verification must be done manually.

## Verification

Since this is a WSL 1 environment, manual verification is required:

- Use `npm run lint` to check code style
- No typecheck or build commands available
- All changes must be verified through code review
- Test manually in browser for UI functionality

## Skills

Loaded OpenCode skills:

- `clerk-nextjs-patterns`: Advanced Next.js patterns including middleware, Server Actions, and caching
- `nextjs-best-practices`: Next.js App Router principles, Server Components, and data fetching patterns

## Service Path Conventions

All API paths follow the OpenAPI spec (camelCase paths):
- Reportes: `/Api/Reportes/incidentes`, `/Api/Reportes/memorandums`, `/Api/Reportes/estado-maquinaria`
- Cobros: `/Api/Cobros/pagos`, `/Api/Cobros/qrs/{idQr}/imagen`

Backend ASP.NET routing is case-insensitive, so PascalCase also works, but frontend uses lowercase per spec.

## API Client (`src/lib/api/client.ts`)

- Three request functions: `peticion()` (JSON), `peticionBinaria()` (file uploads), `peticionFormData()` (form data)
- All include `credentials: 'include'` for cookie forwarding
- Centralized error handling with `ApiError` class
- `cookieHeader()` helper for Server Components to forward cookies

## Types Convention

- POST request bodies use **PascalCase** properties (matching backend .NET DTOs): `AgregarMaquinaria`, `AñadirServicio`, `CrearCobro`, `NuevoUsuario`
- Response/GET types use **camelCase** properties: `ListarMaquinaria`, `InfoServicio`, `ListarCobro`
- **Exception**: Reportes types (`ListaIncidente`, `InfoIncidente`, `ListHistorialEstadoMaquinaria`) use PascalCase as returned by backend
- **Exception**: Capacitaciones/Uniformes types use PascalCase per OpenAPI spec
- **Exception**: Catalogos/Proveedores types mixed (some Pascal, some camel)
- Helper functions `valorId()`/`valorDetalle()` in client components handle both `{ Id, Detalle }` and `{ id, detalle }` and `{ id, nombre }` shapes

## Critical Type Mismatch Issue

- **Maquinaria API mismatch**: The `/Api/Maquinaria` endpoint returns PascalCase properties (`IdMaquinaria`, `NombreMaquinaria`, `CodigoInventario`, `TipoMaquinaria`) but the frontend expects camelCase (`idMaquinaria`, `nombreMaquinaria`, `codigoInventario`, `tipoMaquinaria`)
- **Reportes API mismatch**: The `/Api/Reportes/estado-maquinaria` endpoint returns PascalCase properties (`IdHistorial`, `NombreMaquinaria`, `CodigoINV`, `EstadoCalidad`, `FechaCambio`, `Descripcion`) but the frontend expects camelCase
- This causes data to display as "-" or undefined because the TypeScript interfaces don't match the actual API response structure

## Missing Endpoints (not consumed in UI)

- `UsuariosService.listarCapacitaciones`, `crearCapacitacion`, `infoCapacitacion`, `inscribirCapacitacion` — types exist, service methods exist, no UI
- `UsuariosService.listarUniformes`, `crearUniforme`, `asignarUniforme`, `listarAsignacionesUniformes` — types exist, service methods exist, no UI
- `ClientesService.crear`, `info` — service methods exist, UI not built
- WebSocket `/ws` — not consumed

## Interactive Modules

All admin modules except `catalogos/` are now interactive Client Components.

**Pattern for CRUD modules:**
1. Server `page.tsx` fetches data + catalogs, passes to a Client Component wrapper
2. Client Component uses `useState` for modal/selection state, calls service methods directly
3. After mutation, call `service.listar()` again to refresh data client-side
4. Modal components are inline render functions in the same file

### Usuarios CRUD

Located at `src/app/Administrador/usuarios/`.

| File | Type | Purpose |
|------|------|---------|
| `page.tsx` | Server Component | Fetches users + 7 catalogs, passes to `<UsuariosClient>` |
| `components/UsuariosClient.tsx` | `'use client'` | Table, detail panel, 7 modals + exportar CSV |

### Key implementation details

- **`infoCompleta`**: Calls `GET /Api/Trabajadores/{ci}` (NOT `/Api/Usuarios/{id}` — that endpoint doesn't exist).
- **Catalogs**: `estados-civiles`, `grados-academicos`, `generos`, `paises`, `zonas`, `carreras` are fetched server-side and passed as props. `roles` and `tipos-documento` are fetched **client-side** by modals.
- **Detail panel**: Shows user info via `infoCompleta` (returns `rol`, `servicioAsignado`, `carreras`, `telefonos`). Document list removed from detail panel — only accessible via `ModalVerDocumentos`.
- **Service filter**: Toggle buttons (Todos/Con Servicio/Sin Servicio) call `GET /Api/Usuarios/{servicio}`.
- **Select mapping**: Catalogs return `{ id, nombre }` (not `{ Id, Detalle }`). `valorId()`/`valorDetalle()` helpers handle both shapes.
- **toLocaleString**: Always pass locale, e.g. `u.salario.toLocaleString('es-BO')`, to avoid hydration errors.
- **catch**: All error handlers use `catch (err: unknown)` + `err instanceof Error`, never `any`.

### New Interactive Modules Added

| Module | File | Features |
|--------|------|----------|
| **Productos** | `productos/components/ProductosClient.tsx` | Table + crear + editar nombre + editar descripción |
| **Proveedores** | `proveedores/components/ProveedoresClient.tsx` | Table with row click → detail panel + crear + agregar teléfono + editar nombre |
| **Cobros** | `cobros/components/CobrosClient.tsx` | Table with row click → detail panel + pagos list + registrar pago + ver/crear QRs |
| **Reportes Incidentes** | `reportes/incidentes/components/IncidentesClient.tsx` | Table with row click → detail panel + crear incidente |
| **Reportes Memorandos** | `reportes/memorandos/page.tsx` | Client page inline: crear memorandum + descargar PDF por ID |
| **Reportes Memorandums** | `reportes/memorandums/` | Client page: listar memorandums + crear memorandum |
| **Reportes Maquinaria** | `reportes/maquinaria/components/MaquinariaHistorialClient.tsx` | Table + cambiar estado + exportar CSV |
