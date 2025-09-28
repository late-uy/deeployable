#!/usr/bin/env bash
set -euo pipefail

if [ ! -d api/prisma/var ]; then
  mkdir -p api/prisma/var
fi

if [ ! -f api/.env ]; then
  cp api/.env.example api/.env
fi

if [ ! -f ui/.env ]; then
  cp ui/.env.example ui/.env
fi

echo "Instalando dependencias..."
npm install

echo "Preparando API..."
npm run --workspace api setup

echo "Preparando UI..."
npm run --workspace ui setup

echo "Creando usuario raíz si es necesario..."
node scripts/bootstrap-admin.mjs

echo "Listo. Credenciales iniciales impresas arriba si se creó un usuario nuevo."
