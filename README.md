# Deeployable

Plataforma auto‑alojada tipo “Vercel” (alpha) para desplegar proyectos con Next.js/Node.

- Estado: Alpha (no usar aún en producción crítica).
- Monorepo: `infra/`, `api/` (NestJS + Prisma), `ui/` (Next.js App Router).

## Requisitos mínimos

- Node.js LTS (última estable)
- Git
- Docker (opcional, solo si quieres deploys reales con contenedores)

## Quickstart (Node‑only)

```bash
git clone https://github.com/<tu-user>/deeployable.git
cd deeployable
npm install
npm run build
npm run start
```

- UI: `http://<host>:8080`
- API: `http://<host>:3001/health`

## Configuración inicial

1) Entra a `http://<host>:8080/setup` y crea el usuario root.
2) Crea un Proyecto (repo, branch, comandos build/start, puerto runtime).
3) Crea un Environment para el proyecto (p. ej., `prod`).
4) Dominios: añade uno administrado o custom y verifica CNAME si aplica.
5) Webhooks: configura `POST /hooks/github` con firma HMAC (GitHub) para CI.
6) Deploy: ejecuta “Deploy now” en la pestaña Deploys.

Nota: si no tienes Docker instalado, podrás simular flujos, pero los deploys reales fallarán con mensaje claro.

## Puertos por defecto y cómo cambiarlos

| Servicio | Puerto | Cómo cambiar |
|---------|--------|--------------|
| API (Nest) | 3001 | `PORT` en `api/.env` o variable de entorno |
| UI (Next) | 8080 | `PORT` en `ui/.env.local` o variable de entorno |

La UI consume la API vía `NEXT_PUBLIC_API_BASE`. Por defecto apunta a `http://localhost:3001` en desarrollo.

## Base de datos

- Por defecto: SQLite (archivo único), ideal para desarrollo/alpha.
- Migrar a Postgres más adelante:
  1) Cambia `DATABASE_URL` a Postgres (por ejemplo, `postgresql://user:pass@host:5432/db?schema=public`).
  2) Ejecuta `npm run db:migrate -w api` (o `npm run db:dev -w api` en desarrollo).

## Variables de entorno clave

- UI (`ui/.env.local`):
  - `NEXT_PUBLIC_API_BASE` (default: `http://localhost:3001`)
  - `PORT` (default: `8080`)
- API (`api/.env`):
  - `PORT` (default: `3001`)
  - `JWT_SECRET` (obligatoria en producción)
  - `NODE_ENV` (por ejemplo, `production`)
  - `DATABASE_URL` (default SQLite `file:./dev.db`)
  - `PUBLIC_SUBDOMAIN_SUFFIX` (para verificación de dominios)
  - `GITHUB_WEBHOOK_SECRET` (para validar `X-Hub-Signature-256`)

## Seguridad

- Autenticación JWT con roles: `root`, `admin`, `viewer`.
- Recomendaciones:
  - Usa un `JWT_SECRET` robusto y rota tokens periódicamente.
  - Activa HTTPS/TLS detrás de un proxy (Traefik, Nginx) en entornos públicos.
  - Restringe accesos a la API por red/VPN cuando sea posible.

## Ejecución

- API
  - Dev: `npm run dev -w api`
  - Build: `npm run build -w api`
  - Start: `npm run start -w api` (usa `PORT`, default 3001)
- UI
  - Dev: `npm run dev -w ui` (usa `PORT`, default 8080)
  - Build: `npm run build -w ui`
  - Start: `npm run start -w ui` (usa `PORT`, default 8080)

PM2 (opcional, no obligatorio):

```bash
pm2 start npm --name deeployable-api -- run start -w api
pm2 start npm --name deeployable-ui -- run start -w ui
pm2 save
```

## Deploys reales (opcional)

Instala Docker en el host/VPS. La API detecta su disponibilidad y habilita build/run de contenedores con health‑checks y blue/green.

## Roadmap

- Persistencia de usuarios y permisos avanzados
- Integraciones CI/CD adicionales (GitLab, Bitbucket)
- Plantillas de proyectos y variables de entorno seguras
- Métricas y logs centralizados

## Licencia

MIT
