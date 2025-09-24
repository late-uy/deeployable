# Contribuir a Deeployable

Gracias por tu interés en contribuir.

## Prerrequisitos
- Node.js LTS (última estable)
- Git
- Docker (opcional, sólo para probar deploys reales)

## Estilo y PRs
- Usa npm (no pnpm ni yarn).
- Mantén las PRs pequeñas y con descripciones claras.
- Sigue las reglas de ESLint/Prettier del repo.

## Cómo correr
- UI (Next): `npm run dev -w ui` (puerto por defecto 8080)
- API (Nest): `npm run dev -w api` (puerto por defecto 3001)

## Tests
- Si se agregan tests, podrás correrlos con: `npm test -w api` o `npm test -w ui`.

## Seguridad
- No incluyas secretos en commits. Usa `.env` locales.
