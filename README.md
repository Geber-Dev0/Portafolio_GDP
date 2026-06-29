# Vestitus - Plataforma Web de Arriendo y Venta de Vestuario

**Grupo 3** | TPY1101 - Taller Aplicado de Programación | Duoc UC

## Integrantes

| Nombre | Rol |
|--------|------|
| Gabriel Hermosilla | Analista de negocio / Coordinador |
| Deyanira Leyton | Analista Funcional / Diseño UX-UI |
| Priscila Calderón | Arquitecto cloud / Backend |

## Estructura del proyecto

```
Portafolio/
├── Documentación/          ← Informes, UML, WireFrame, MER, Gantt, presentaciones
├── Gestión/                ← Documentos de gestión del proyecto
├── Producto/               ← Código fuente, scripts SQL y documentación técnica
│   ├── Script/             ← Migraciones y backups SQL
│   │   ├── vestitus-schema.sql
│   │   ├── vestitus_backup_20250530.sql
│   │   └── test-database-setup.sql
│   ├── vestitus-backend/   ← API REST (Node.js + Express + TypeScript)
│   │   ├── src/            ← Controladores, servicios, rutas, middleware
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── package.json
│   └── vestitus-frontend/  ← Frontend React + TypeScript + Vite + Tailwind
│       ├── src/            ← Páginas, componentes, contextos, servicios
│       ├── index.html
│       └── package.json
├── .gitignore
└── README.md
```

## Stack tecnológico

| Componente | Tecnología |
|------------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 |
| Backend | Node.js 20 + Express + TypeScript |
| Base de datos | PostgreSQL 15 (Supabase) |
| Autenticación | JWT + bcrypt |
| Imágenes | Cloudinary CDN |
| Validación | Zod 3.23 |
| Testing | Vitest 4 (102 tests, 100% passing) |
| Geocoding | OpenCageData API |
| Shipping | Multicouriers API (Starken) |
| Contenedor | Docker (node:20-alpine) |
| Deploy backend | Vercel |
| Deploy frontend | Render |
| Control de versiones | GitHub |

## Enlaces

| Recurso | URL |
|---------|-----|
| Repositorio | https://github.com/Geber-Dev0/Portafolio_GDP.git |
| API (producción) | `https://vestitus-api.vercel.app/api` |
| Frontend | `https://vestitus-frontend.onrender.com` |

## Documentación técnica

| Documento | Ubicación |
|-----------|-----------|
| Informe diseño solución | `Producto/vestitus-backend/doc/INFORME_DISENO_SOLUCION.md` |
| Plan de pruebas (44 casos) | `Producto/vestitus-backend/doc/PLAN_DE_PRUEBAS.md` |
| Esquema BD completo | `Producto/Script/vestitus-schema.sql` |
| BD de pruebas | `Producto/Script/test-database-setup.sql` |
