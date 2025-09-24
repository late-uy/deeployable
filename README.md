# Deeployable

**Deeployable** es un mini-Vercel open source para uso propio o en equipos pequeños.  
Su objetivo es permitirte desplegar proyectos de Node.js/Next.js en tu propio servidor (local o VPS) con una interfaz de administración simple.

---

## ✨ Características

- 🌐 Panel UI para administrar proyectos, ambientes y dominios.  
- ⚙️ API backend en NestJS con Prisma y PostgreSQL.  
- 📦 Infraestructura lista con `docker-compose` (Traefik como reverse proxy).  
- 🔐 Manejo de certificados SSL (Cloudflare DNS).  
- 🚀 Despliegues continuos con integración a repositorios Git.  
- 🛠️ Extensible y escalable para múltiples desarrolladores.  

---

## 📂 Estructura del proyecto

```bash
deeployable/
 ├── api/          # Backend (NestJS + Prisma)
 ├── ui/           # Frontend (Next.js 15, App Router, TypeScript)
 ├── infra/        # Infraestructura con docker-compose y Traefik
 ├── package.json  # Configuración raíz
 └── README.md
```

---

## 🚀 Quickstart

### 1. Clonar el repo
```bash
git clone https://github.com/late-uy/deeployable.git
cd deeployable
```

### 2. Instalar dependencias
Instala las dependencias de raíz, frontend y backend:

```bash
npm install
cd api && npm install && cd ..
cd ui && npm install && cd ..
```

### 3. Variables de entorno

Copia los archivos `.env.example` y ajústalos según tu entorno:

```bash
cp api/.env.example api/.env
cp ui/.env.example ui/.env
```

Configura en particular:

- **Base de datos**: `DATABASE_URL=postgresql://...`
- **Prisma**: usado por `api`
- **Cloudflare** (solo en producción):
  - `CF_DNS_API_TOKEN=...`
  - `CF_API_EMAIL=...`
  - `CF_API_KEY=...`
  - `ACME_EMAIL=...`

### 4. Levantar con Docker Compose

Desde `infra/`:

```bash
cd infra
docker compose up -d --build
```

Esto arranca:

- **Traefik** → reverse proxy en `http://localhost`  
- **UI** → `http://admin.deeployable.localhost/`  
- **API** → `http://api.deeployable.localhost/health`  

---

## 🖥️ Uso en VPS

En un servidor con Ubuntu y Node.js instalado:

1. **Clonar el repo**
   ```bash
   git clone https://github.com/late-uy/deeployable.git
   cd deeployable
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   cd api && npm install && cd ..
   cd ui && npm install && cd ..
   ```

3. **Construir**
   ```bash
   npm run build
   ```

4. **Ejecutar**
   ```bash
   npm start
   ```

Luego accede a la interfaz web en el puerto configurado (por defecto `http://localhost:8080`).

> En producción, se recomienda usar **Docker Compose** con Traefik y configurar dominios reales + certificados.

---

## 📖 Documentación

- [NestJS](https://docs.nestjs.com/)  
- [Next.js App Router](https://nextjs.org/docs/app)  
- [Prisma ORM](https://www.prisma.io/docs/)  
- [Traefik Proxy](https://doc.traefik.io/)  

---

## 🛠️ Roadmap

- [ ] Integración directa con GitHub/GitLab para despliegues automáticos.  
- [ ] Gestión avanzada de ambientes (dev/staging/prod).  
- [ ] Configuración de secretos desde la UI.  
- [ ] Instalador CLI (`npx deeployable init`).  

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!  
Por favor, revisa [CONTRIBUTING.md](./CONTRIBUTING.md) para más detalles.

---

## 📜 Licencia

Este proyecto está bajo la licencia [MIT](./LICENSE).
