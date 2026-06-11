# AGENTS.md — SASL Frontend

## Stack

- Next.js 16.2.4 (App Router), React 19.2.4, TypeScript 5
- Tailwind CSS v4 — no `tailwind.config`. Uses `@import "tailwindcss"` + `@theme` in `src/app/globals.css`
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- PostCSS via `@tailwindcss/postcss`
- ESLint 9 (`next/core-web-vitals` + `next/typescript`)
- No typecheck script. No test framework.

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
│   ├── Administrador/   # Stub (empty layout.tsx + page.tsx)
│   ├── login/           # 2FA flow (credenciales → doble-factor)
│   │   ├── components/  # Client components (ContenedorLogin, FormularioCredenciales, DobleFactor, VisualLogin)
│   │   └── hooks/       # useAutenticacion.ts — fetch calls
│   ├── layout.tsx       # Root layout (Outfit + DM Sans fonts)
│   ├── page.tsx         # Landing page (Navbar, Hero, Nosotros, Servicios, Licencias, Footer)
│   └── globals.css      # Tailwind import + @theme + custom classes
├── components/
│   ├── atoms/           # BotonPrimario, BotonSecundario, BotonCTA, BadgePill, etc.
│   ├── molecules/       # TarjetaServicio, TarjetaLicencia, EstadisticasHero, etc.
│   └── organisms/       # Navbar, SeccionHero, SeccionNosotros, SeccionServicios, PiePagina
└── middleware.ts        # JWT-based role redirect
```

- **Public routes**: `/` (landing) and `/login`
- **Role pages** (`/admin`, `/gerente`, `/trabajador`, `/cliente`) are not yet implemented — only `Administrador/` exists as an empty stub.
- **Client components** (`'use client'`): all login components (`ContenedorLogin`, `FormularioCredenciales`, `DobleFactor`, `useAutenticacion`), `BotonVolverArriba`, `AnimacionEntrada`.
- **Component naming**: Spanish throughout (atoms, molecules, organisms).

## Middleware (`src/middleware.ts`)

- Reads JWT from cookie named **`token`**, decodes `rol` from payload
- Already-authenticated users at `/login` → redirect to `/{rol}`
- Unauthenticated users at role paths → redirect to `/login`
- Role mismatch → redirect to correct `/{rol}`
- Matcher: `/admin/:path*`, `/gerente/:path*`, `/trabajador/:path*`, `/cliente/:path*`, `/login/auth`

## Known Backend API Mismatches

OpenAPI spec in `doc-api/openapi.yaml` (base: `http://localhost:5112`):

| Aspect | Backend Expects | Frontend Sends |
|--------|----------------|----------------|
| Cookie name | `token_sesion` | Reads `token` in middleware |
| `solicitar-2fa` body | `{ correo, password }` | `{ usuario, contraseña }` |
| `verificar-2fa` body | `{ email, codigoIngresado }` | `{ codigo }` |
| `verificar-2fa` response | `{ mensaje }` (per OpenAPI) | Uses `datos.redireccion` |

## Design Tokens

Navy palette (`--color-navy-50`–`900`) and chuxna green (`--color-chuxna*`) defined via `@theme` in CSS. Duplicated as CSS custom properties in `:root` — some components reference the CSS vars directly.

## Fonts

- Outfit (display) — `var(--font-outfit)`
- DM Sans (body) — `var(--font-dm-sans)`
- Login page uses Inter (local import in `src/app/login/layout.tsx`)

## Notable

- No `.env` file committed (all `.env*` gitignored). API URL `http://localhost:5112` hardcoded in `useAutenticacion.ts`.
- `doc-api/openapi.yaml` describes the full backend API (2644 lines). Auth cookie: `token_sesion` (HttpOnly, Secure, SameSite=Strict). Security policies: `PersonalAutorizado` (Gerente/Admin), `Cliente`, `cookieAuth`.
- Client login 2FA endpoints exist (`/Api/Clientes/solicitar-2fa`, `/Api/Clientes/verificar-2fa`) but are not yet consumed in frontend.
- WebSocket at `/ws` (cookie-authenticated) exists in API but is not consumed.
- Build artifacts: `.next/`, `out/`, `build/` gitignored. `.opencode/` also gitignored.
- No `opencode.json` config — session behavior is governed by `AGENTS.md` and loaded skills.
