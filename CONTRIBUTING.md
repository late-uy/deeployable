# Contribuir a Deeployable

¡Gracias por tu interés! Este proyecto sigue un flujo GitHub estándar basado en *feature branches* y revisiones mediante Pull Requests.

## Flujo de trabajo

1. Crea un fork o rama nueva desde `main`.
2. Para funcionalidades, abre un issue describiendo el objetivo.
3. Usa ramas con prefijo `feature/`, `fix/` o `docs/`.
4. Asegúrate de que `./bootstrap.sh` corre sin errores antes de abrir el PR.

## Estilo de código

- TypeScript estricto y ESLint v9 con `typescript-eslint` v8.
- Formatea con Prettier (`npm run format` si lo añades localmente).
- No ignores errores de TypeScript ni uses `any` salvo justificación en comentarios.

## Commits

- Mensajes en español o inglés, en infinitivo: `feat: añadir pantalla de dominios`.
- Agrupa cambios relacionados en un solo commit cuando sea posible.

## Revisiones

- Todo PR debe incluir descripción clara y pasos de prueba.
- Ejecuta `npm run setup`, `npm run build` y `npx prisma migrate diff` si tocas la base de datos.

¡Happy shipping! 🚀
