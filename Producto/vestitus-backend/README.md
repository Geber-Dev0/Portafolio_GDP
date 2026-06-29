# Vestitus Backend

API REST para plataforma de arriendo y venta de vestuario (PYME).

## Stack

- **Runtime**: Node.js 20 + TypeScript + Express
- **DB**: PostgreSQL via Supabase
- **Auth**: JWT + bcrypt (12 rounds)
- **Imágenes**: Cloudinary
- **Seguridad**: Helmet, CORS, rate-limit, Zod validation
- **Docker**: Multi-stage build (node:20-alpine), 227MB final image
- **Testing**: Vitest 4 (79 tests, 100% passing)

## Requisitos

- Node.js 20+
- Docker (opcional)
- Una cuenta en [Supabase](https://supabase.com) y [Cloudinary](https://cloudinary.com)

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=<tu_secreto_jwt>
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_KEY=<service_role_key>
CLOUDINARY_CLOUD_NAME=<nombre>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

> `SUPABASE_KEY` debe ser la **service_role key** (bypass RLS). La anon key es para el frontend.

## Inicio rápido

```bash
# Local (sin Docker)
npm install
npm run dev        # desarrollo con hot-reload

# Build + producción
npm run build
npm start

# Docker
docker compose up -d    # construye y corre en :4000
```

## Credenciales de prueba

```
Email:    admin@tienda.cl
Password: test1234
```

## API Base

```
Local:      http://localhost:4000/api
Producción: https://<tu-app>.onrender.com/api
```

### Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | - | Registrar usuario |
| POST | /api/auth/login | - | Login, devuelve JWT |
| GET | /api/auth/me | Sí | Perfil actual |
| POST | /api/auth/logout | Sí | Cerrar sesión |
| GET | /api/health | - | Health check |
| GET | /api/products | - | Listar (filtros: ?category=, ?type=, ?available=) |
| GET | /api/products/:id | - | Detalle producto |
| POST | /api/products | Admin/Employee | Crear |
| PUT | /api/products/:id | Admin/Employee | Actualizar |
| DELETE | /api/products/:id | Admin | Eliminar |
| POST | /api/products/:id/images | Admin/Employee | Subir imagen |
| DELETE | /api/products/:id/images/:imageId | Admin/Employee | Eliminar imagen |
| POST | /api/check-availability | - | Verificar disponibilidad |
| GET | /api/clients | Admin/Employee | Listar |
| PUT | /api/clients/:id | Admin/Employee | Actualizar |
| DELETE | /api/clients/:id | Admin | Eliminar |
| POST | /api/clients | Sí | Crear |
| GET | /api/rentals | Admin/Employee | Listar |
| POST | /api/rentals | Sí | Crear |
| GET | /api/returns | Admin/Employee | Listar |
| POST | /api/returns | Admin/Employee | Crear |
| GET | /api/sales | Admin/Employee | Listar |
| POST | /api/sales | Sí | Crear |
| GET | /api/dispatches | Admin/Employee | Listar |
| POST | /api/dispatches | Admin/Employee | Crear |
| GET | /api/damage-types | - | Listar |
| POST | /api/damage-types | Admin/Employee | Crear |
| GET | /api/shipping/quote | - | Cotizar envío (query: ?address=, ?city=) |
| GET | /api/corporate-info | - | Obtener |
| PUT | /api/corporate-info/:id | Admin/Employee | Actualizar |

## Tests

```bash
npm test            # ejecutar tests (79 tests, Vitest)
npm run test:watch  # modo watch
```

Los tests cubren: autenticación, CRUD productos, arriendos, ventas, middleware, validadores.

## Documentación

| Documento | Ubicación |
|-----------|-----------|
| Informe diseño solución | `doc/INFORME_DISENO_SOLUCION.md` |
| Plan de pruebas | `doc/PLAN_DE_PRUEBAS.md` |
| Informe pruebas EP3 | `doc/INFORME_PRUEBAS_EP3.doc` |

## Deploy en Vercel

1. Crear repo en GitHub y pushear
2. En Render: **New Web Service** → conectar repo
3. Runtime: **Docker** (Render detecta el Dockerfile automáticamente)
4. Setear env vars (las mismas del `.env`, con `NODE_ENV=production`)
5. Render asigna una URL tipo `https://<nombre>.onrender.com`

> El plan gratuito de Render "duerme" el servicio tras 15 min sin uso. La primera request tras el sueño tarda ~30s en responder.

## Estructura del proyecto

```
src/
├── app.ts                # Setup Express
├── server.ts             # Entry point
├── database.ts           # Cliente Supabase
├── config/index.ts       # Env vars
├── routes/               # Definición de rutas
├── controllers/          # Handlers HTTP
├── services/             # Lógica de negocio
├── middleware/           # Auth, validación
├── validators/index.ts   # Schemas Zod
├── types/index.d.ts      # Tipos
└── utils/                # Logger, error handler
```

## Seguridad

- JWT expira en 24h
- bcrypt 12 rounds
- Rate-limit global: 100 requests / 15 min
- Rate-limit auth: 20 requests / 15 min
- Helmet (HTTP headers seguros)
- CORS whitelist configurable
- Zod validation en todos los POST/PUT
- Sin fuga de errores en producción (`NODE_ENV=production`)
