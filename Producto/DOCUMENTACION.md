# INFORME ESTADO DE AVANCE 3

## Vestitus — Plataforma Web de Arriendo y Venta de Vestuario

**Asignatura:** TPY1101 - Taller Aplicado de Programación  
**Sigla:** TPY1101  
**Sección:** 002D  
**Grupo:** 3  
**Fecha:** Junio 2026

### Integrantes

| Nombre | Rol |
|--------|-----|
| Gabriel Hermosilla | Analista de negocio / Coordinador |
| Deyanira Leyton | Analista Funcional / Diseño UX-UI |
| Priscila Calderón | Arquitecto cloud / Backend |

---

# Índice

1. [Introducción](#1-introducción)
2. [Desarrollo Evaluación Parcial 1](#2-desarrollo-evaluación-parcial-1)
    - 2.1. Stack Tecnológico
    - 2.2. Requerimientos Funcionales
    - 2.3. Páginas y Rutas
    - 2.4. Servicios API
    - 2.5. Reglas de Negocio
    - 2.6. Arquitectura del Proyecto
    - 2.7. Problemas Conocidos
3. [Desarrollo Evaluación Parcial 2](#3-desarrollo-evaluación-parcial-2)
    - 3.1. IL2.1 — Documentos de Diseño de la Solución
      - 3.1.1. Metodología de Desarrollo
      - 3.1.2. Patrones de Diseño
      - 3.1.3. Diagramas de Arquitectura
      - 3.1.4. Tecnologías y Herramientas
    - 3.2. IL2.2 — Ambiente de Pruebas
      - 3.2.1. Configuración del Entorno de Pruebas
      - 3.2.2. Pruebas Operativas
      - 3.2.3. Pruebas de Validación
      - 3.2.4. Pruebas de Verificación
      - 3.2.5. Mejores Prácticas de la Industria
    - 3.3. IL2.3 — Copia de Seguridad y Configuración del Servidor
      - 3.3.1. Procedimiento de Backup de Base de Datos
      - 3.3.2. Configuración del Servidor de Producción
      - 3.3.3. Instalación de Lenguajes, Librerías y Herramientas
    - 3.4. IL2.3 — Desarrollo de la Solución
      - 3.4.1. Arquitectura del Código Fuente
      - 3.4.2. Funcionalidades de Negocio Implementadas
      - 3.4.3. Buenas Prácticas de Programación
      - 3.4.4. Seguridad Implementada
4. [Estado de Avance](#4-estado-de-avance)
    - 4.1. Tabla de Avance por Módulo
    - 4.2. KPIs del Proyecto
5. [Pruebas Ejecutadas EP2](#5-pruebas-ejecutadas)
    - 5.1. Backend (79 tests)
    - 5.2. Frontend (23 tests)
6. [Conclusiones EP2](#6-conclusiones)
7. [Lecciones Aprendidas EP2](#7-lecciones-aprendidas)
8. [Evaluación Parcial 3 — IL3.1: Plan de Pruebas](#8-evaluación-parcial-3--il31-plan-de-pruebas)
    - 8.1. Plan de Pruebas de Software
    - 8.2. Base de Datos de Pruebas
    - 8.3. Ejecución de Pruebas y Resultados
9. [Evaluación Parcial 3 — IL3.2: Mejoras al Producto](#9-evaluación-parcial-3--il32-mejoras-al-producto)
    - 9.1. Tabla de Mejoras Aplicadas
    - 9.2. Mejora 1: Corrección de Filtro Type (Corrección)
    - 9.3. Mejora 2: SampleProducts Fallback (Usabilidad)
    - 9.4. Mejora 3: Actualización de Documentación (Completitud)
    - 9.5. Mejora 4: Seguridad — npm audit fix (Seguridad)
    - 9.6. Mejora 5: Base de Datos de Pruebas (Seguridad/Pertinencia)
    - 9.7. Mejora 6: Plan de Pruebas Formal (Completitud)
10. [Evaluación Parcial 3 — IL3.3: Informe y Evidencias](#10-evaluación-parcial-3--il33-informe-y-evidencias)
    - 10.1. Evidencias de Copias de Configuración
    - 10.2. Documento de Aceptación
    - 10.3. Información Relevante del Proyecto
11. [Conclusiones EP3](#11-conclusiones-ep3)
12. [Integraciones Externas](#12-integraciones-externas)
    - 12.1. OpenCageData Geocoding API
    - 12.2. Multicouriers API (Starken)
    - 12.3. Variables de Entorno
13. [Lecciones Aprendidas EP3](#13-lecciones-aprendidas-ep3)
    - 13.1. Gestión de Proyecto
    - 13.2. Técnicas y Herramientas
    - 13.3. Integraciones Externas

---

# 1. Introducción

Vestitus es una plataforma web para una PYME chilena dedicada al arriendo y venta de vestuario. El proyecto busca digitalizar procesos que actualmente se realizan de forma manual (llamadas, WhatsApp, planillas Excel), proporcionando un sistema integrado con control de stock en tiempo real, gestión de arriendos y devoluciones con trazabilidad, catálogo digital con filtros, y registro estructurado de clientes.

El presente informe corresponde al **Estado de Avance 2** de la asignatura TPY1101 — Taller Aplicado de Programación. Se incluye el desarrollo completo de la Evaluación Parcial 1 y se agregan los nuevos requerimientos de la Evaluación Parcial 2: documentación de diseño, ambiente de pruebas, procedimientos de backup y configuración de servidor, y el desarrollo funcional de la solución.

---

# 2. Desarrollo Evaluación Parcial 1

## 2.1. Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| Frontend | React 19 + TypeScript 5 + Vite 8 + Tailwind CSS 4 |
| Backend | Node.js 20 + Express 4 + TypeScript |
| Base de datos | PostgreSQL 15 (Supabase) |
| Autenticación | JWT (jsonwebtoken) + bcrypt (12 rounds) |
| Validación | Zod 4 |
| Imágenes | Cloudinary + multer (in-memory) |
| Contenedor | Docker (node:20-alpine, multi-stage) |
| Despliegue frontend | Render (static site) |
| Despliegue backend | Vercel (Docker runtime) |
| Control de versiones | Git + GitHub |
| Documentación API | Swagger (swagger-jsdoc + swagger-ui-express) |

## 2.2. Requerimientos Funcionales

1. **Catálogo**: grid de productos con filtros por categoría, tipo, disponibilidad y búsqueda.
2. **Detalle producto**: galería de imágenes, selección arriendo/compra, fechas para arriendo.
3. **Carrito**: items mixtos (rent + sale), fechas para arriendo, cálculo de precios y total.
4. **Checkout**: creación de rentals y sales con rollback en caso de fallo.
5. **Autenticación**: login, register, JWT persistente, roles (customer, admin, employee).
6. **Perfil**: datos de usuario, facturación, historial de compras, enlace a arriendos.
7. **Admin dashboard**: CRUD completo (productos, clientes, arriendos, ventas, devoluciones, daños, info corporativa).
8. **Nosotros**: página institucional con misión/visión/objetivos desde API.
9. **Gestión de inventario**: control de stock en tiempo real, disponibilidad por fechas.
10. **Gestión de arriendos**: registro con fechas, cálculo automático de precio, verificación de disponibilidad.
11. **Gestión de devoluciones**: registro con estado, tipo de daño, cálculo de recargo, actualización de stock.
12. **Despachos**: registro con datos de envío, courier, costo (backend listo, frontend pendiente).

## 2.3. Páginas y Rutas

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | Home | Público |
| `/login` | Login | Público |
| `/register` | Register | Público |
| `/products` | Products (Catálogo) | Público |
| `/products/:id` | ProductDetail | Público |
| `/cart` | Cart | Público |
| `/checkout` | Checkout | Requiere auth |
| `/corporate-info` | CorporateInfo (Nosotros) | Público |
| `/rentals` | Rentals (Mis Arriendos) | Requiere auth |
| `/purchases` | Purchases (Mis Compras) | Requiere auth |
| `/profile` | Profile | Requiere auth |
| `/admin` | AdminDashboard | Admin/Employee |
| `*` | NotFound | Público |

## 2.4. Servicios API

| Servicio | Endpoint base | Métodos |
|----------|--------------|---------|
| auth.service | `/auth` | login, register, me, logout |
| products.service | `/products` | getAll, getById, create, update, delete, uploadImage, deleteImage |
| clients.service | `/clients` | getAll, getById, create, update, delete |
| rentals.service | `/rentals` | getAll, getById, create, update, delete, getSelf, cancelSelf |
| sales.service | `/sales` | getAll, getById, create, update, delete, getSelf |
| returns.service | `/returns` | getAll, getById, create |
| dispatches.service | `/dispatches` | getAll, getById, create, update, delete |
| damage-types.service | `/damage-types` | getAll, create, update, delete |
| corporate-info.service | `/corporate-info` | get, update |

## 2.5. Reglas de Negocio

1. **Stock**: si product.stock ≤ 0, botón add-to-cart deshabilitado + mensaje "Sin stock".
2. **Cantidad**: si itemCount ≥ product.stock, botón deshabilitado + límite alcanzado.
3. **Fechas arriendo**: dos date pickers (inicio + término) sincronizados con stepper de días (1-30).
4. **Precio arriendo**: estimado en checkout = price × días según period_type.
5. **Rollback**: si falla la creación de un item en checkout, se eliminan los rentals ya creados.
6. **Disponibilidad**: un producto ocupado en un rango de fechas aparece como no disponible.
7. **Daños**: al registrar devolución con daño, se aplica recargo de damage_types.surcharge_amount.
8. **Producto dañado**: si se marca como perdido/dañado, is_available = false.
9. **clientId**: se busca automáticamente tras login/me por email en clients table.
10. **Imágenes**: solo JPEG, PNG, WebP, AVIF; siempre pasan por backend → Cloudinary.

## 2.6. Arquitectura del Proyecto

```
Portafolio/
├── Documentación/           ← Informes, presentaciones
├── Gestión/                 ← Documentos de gestión del proyecto
├── Producto/
│   ├── vestitus-backend/    ← API REST
│   │   ├── doc/              ← Informes, plan pruebas, documentación interna
│   │   │   ├── vestitus-schema.sql     ← Esquema completo BD
│   │   │   ├── test-database-setup.sql ← BD de pruebas
│   │   │   ├── PLAN_DE_PRUEBAS.md      ← 44 casos de prueba
│   │   │   └── INFORME_DISENO_SOLUCION.md/.doc ← Informe final
│   │   ├── src/
│   │   │   ├── controllers/  ← Controladores por recurso
│   │   │   ├── services/     ← Lógica de negocio
│   │   │   ├── routes/       ← Definición de rutas + JSDoc Swagger
│   │   │   ├── middleware/   ← auth, validate, error, upload
│   │   │   ├── validators/   ← Schemas Zod
│   │   │   └── __tests__/    ← Tests unitarios
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── vestitus-frontend/   ← Frontend React
│       ├── src/
│       │   ├── pages/        ← 13 páginas
│       │   ├── contexts/     ← AuthContext, CartContext, ToastContext
│       │   ├── services/     ← Clientes API (axios)
│       │   ├── components/   ← Componentes reutilizables
│       │   └── __tests__/    ← Tests unitarios
│       └── vite.config.ts
└── README.md
```

## 2.7. Problemas Conocidos

1. **Cold start**: Render free tier duerme después de 15 min inactivo; primera solicitud toma ~30-60s.


---

# 3. Desarrollo Evaluación Parcial 2

## 3.1. IL2.1 — Documentos de Diseño de la Solución

### 3.1.1. Metodología de Desarrollo

Se utiliza **Scrum** como metodología ágil de desarrollo, adaptada al contexto académico con las siguientes prácticas:

- **Sprints**: duración de 2 semanas cada uno, con entregas parciales al docente guía.
- **Product Backlog**: historias de usuario priorizadas por valor de negocio.
- **Sprint Planning**: al inicio de cada sprint, se seleccionan las historias a implementar.
- **Daily Standup**: reuniones diarias de 5-10 minutos para sincronizar avances.
- **Sprint Review**: demostración del incremento al docente guía al final de cada sprint.
- **Retrospective**: al cierre de cada sprint, se identifican oportunidades de mejora.

**Herramientas de gestión**:
- GitHub Projects para tablero Kanban del sprint.
- Git con branching strategy: `main` (producción), `dev` (integración), `feature/*` (features individuales).
- Pull requests con revisión cruzada entre integrantes.

### 3.1.2. Patrones de Diseño

| Patrón | Aplicación | Ubicación |
|--------|-----------|-----------|
| **MVC (Model-View-Controller)** | Backend organizado en modelos (servicios), vistas (respuestas JSON), controladores (manejo de requests) | `controllers/`, `services/`, `routes/` |
| **Repository Pattern** | Servicios encapsulan lógica de acceso a datos vía Supabase client | `services/*.service.ts` |
| **Middleware Chain** | Express middleware para autenticación, validación, errores | `middleware/` |
| **Context Pattern** | React Context para estado global (auth, cart, toast) | `contexts/` |
| **Observer Pattern** | React hooks para suscripción a cambios de estado | `useAuth`, componentes |
| **Singleton** | Cliente axios configurado una vez y reutilizado | `services/api.ts` |
| **Factory Pattern** | Creación de mocks encadenables en tests con `vi.hoisted()` | `__tests__/` |
| **DTO (Data Transfer Object)** | Schemas Zod para validación y transformación de datos | `validators/` |

### 3.1.3. Diagramas de Arquitectura

#### Diagrama de Componentes

```
[Cliente Web (React)]
        ↕ HTTP/JSON
[API Gateway (Vercel)]
        ↕
[Backend Express (Node.js)]
    ├── [Auth Controller]
    │       ↕
    │   [Auth Service] → [Supabase Auth]
    ├── [Product Controller]
    │       ↕
    │   [Product Service] → [Supabase DB] ←→ [Cloudinary]
    ├── [Client Controller]
    │       ↕
    │   [Client Service] → [Supabase DB]
    ├── [Rental Controller]
    │       ↕
    │   [Rental Service] → [Supabase DB]
    ├── [Sale Controller]
    │       ↕
    │   [Sale Service] → [Supabase DB]
    ├── [Return Controller]
    │       ↕
    │   [Return Service] → [Supabase DB]
    └── [Dispatch Controller]
            ↕
        [Dispatch Service] → [Supabase DB]
```

#### Diagrama de Despliegue

```
[GitHub Repository]
    ↕ push
[Vercel] ←←→ [Supabase PostgreSQL]
  Backend API    (service_role key)
    ↕ HTTP
[Render] ←←←→ [Supabase PostgreSQL]
 Frontend         (anon key)
    ↕
[Navegador Usuario]
```

#### Diagrama de Flujo de Autenticación

```
Usuario → Login → POST /auth/login → Backend valida credenciales
  → bcrypt compare → JWT sign → Response { token, user }
  → Frontend guarda token en localStorage
  → useEffect → GET /auth/me → Verifica sesión
  → Busca clientId por email → GET /clients/self
  → Si no existe client → POST /clients (auto-create)
  → AuthContext actualizado → UI re-renderiza
```

#### Diagrama de Flujo de Compra/Arriendo

```
Usuario agrega items al carrito (CartContext)
  → Navega a /checkout
  → Checkout procesa items secuencialmente:
      Para cada item de tipo "sale":
        → POST /sales → crea venta → descuenta stock
      Para cada item de tipo "rent":
        → POST /check-availability → verifica disponibilidad
        → POST /rentals → crea arriendo → bloquea fechas
  → Si falla algún item:
      → DELETE /rentals/:id (rollback)
      → Muestra error al usuario
  → Éxito: redirige a /purchases o /rentals
```

### 3.1.4. Tecnologías y Herramientas

| Herramienta | Propósito | Versión |
|------------|-----------|---------|
| Visual Studio Code | IDE de desarrollo | Última |
| Node.js | Runtime JavaScript | 20.x LTS |
| TypeScript | Tipado estático | 5.6 (backend) / 6.0 (frontend) |
| React | Biblioteca UI | 19.2 |
| Vite | Build tool | 8.0 |
| Tailwind CSS | Framework CSS | 4.3 |
| Supabase (Dashboard) | Gestión BD PostgreSQL | N/A |
| Cloudinary Dashboard | Gestión de imágenes | N/A |
| Git + GitHub | Control de versiones | N/A |
| Docker Desktop | Contenedores locales | Última |
| Render Dashboard | Despliegue frontend | N/A |
| Vercel Dashboard | Despliegue backend | N/A |
| Postman / Swagger UI | Pruebas de API | N/A |
| Vitest | Framework de pruebas | 4.1 |
| Testing Library | Pruebas de componentes React | Última |

---

## 3.2. IL2.2 — Ambiente de Pruebas

### 3.2.1. Configuración del Entorno de Pruebas

Se configuró **Vitest** como framework de pruebas unitarias, con las siguientes características:

**Backend (`vestitus-backend/vitest.config.ts`):**
- Entorno: Node.js nativo
- Path aliases: mapeo `@/` → `src/` (coincide con tsconfig)
- Mocking: `vi.hoisted()` para crear mocks encadenables de Supabase (cada método de query retorna el mismo builder object, evitando problemas de hoisting)

**Frontend (`vestitus-frontend/vite.config.ts`):**
- Entorno: `jsdom` (simula navegador)
- Setup: `src/test-setup.ts` importa `@testing-library/jest-dom` para matchers como `toBeInTheDocument()`
- Globales: `globals: true` para usar `describe`, `it`, `expect` sin imports

**Comandos de ejecución:**

```bash
# Backend
cd vestitus-backend
npm test                    # vitest run

# Frontend
cd vestitus-frontend
npm test                    # vitest run
```

### 3.2.2. Pruebas Operativas

Pruebas que verifican que los flujos principales de la aplicación funcionan correctamente:

| Prueba | Archivo | Descripción |
|--------|---------|-------------|
| Login exitoso | `AuthContext.test.tsx` | Login con credenciales válidas → token + user en contexto |
| Logout | `AuthContext.test.tsx` | Logout → token y user se limpian |
| Registro de usuario | `auth.service.test.ts` | registerUser → nuevo usuario creado |
| Agregar item al carrito | `CartContext.test.tsx` | addItem (sale y rent) → item aparece con datos correctos |
| Calcular total carrito | `CartContext.test.tsx` | Múltiples items → total se calcula correctamente |
| CRUD productos | `product.service.test.ts` | Crear, leer, actualizar, eliminar producto |
| CRUD arriendos | `rental.service.test.ts` | Crear, leer, actualizar, eliminar arriendo |
| CRUD ventas | `sale.service.test.ts` | Crear, leer, actualizar venta |
| Check availability | `product.service.test.ts` | Producto disponible / no disponible por fechas |
| Ajuste de stock | `product.service.test.ts` | incrementar / decrementar stock |

### 3.2.3. Pruebas de Validación

Pruebas que verifican que los datos de entrada son correctamente validados:

| Prueba | Archivo | Descripción |
|--------|---------|-------------|
| Validación register | `validators.test.ts` | Email inválido → rechazado. Password muy corta → rechazada |
| Validación login | `validators.test.ts` | Campos vacíos → rechazados |
| Validación producto | `validators.test.ts` | Nombre vacío, precio negativo, stock inválido → rechazados |
| Validación cliente | `validators.test.ts` | client_type inválido, email mal formado → rechazados |
| Validación rental | `validators.test.ts` | Fechas inválidas, status incorrecto → rechazados |
| Validación venta | `validators.test.ts` | Cantidad negativa, precio inválido → rechazados |
| Middleware validate | `validate.middleware.test.ts` | Body inválido → 400 error. Body válido → pasa. Query params validados |
| Autenticación | `auth.middleware.test.ts` | Token inválido → 401. Rol no autorizado → 403. Token válido → pasa |

### 3.2.4. Pruebas de Verificación

Pruebas que verifican la correcta configuración del ambiente:

| Verificación | Resultado |
|-------------|-----------|
| TypeScript compila sin errores (backend) | ✅ `npx tsc --noEmit` → 0 errores |
| TypeScript compila sin errores (frontend) | ✅ `npx tsc --noEmit` → 0 errores |
| Build de producción frontend | ✅ `npm run build` → dist/ generado sin errores |
| Tests backend pasan | ✅ 79 tests, 0 fallos |
| Tests frontend pasan | ✅ 23 tests, 0 fallos |
| Servidor dev backend inicia | ✅ `npm run dev` → puerto 4000 |
| Servidor dev frontend inicia | ✅ `npm run dev` → Vite dev server |
| API responde en health endpoint | ✅ `GET /api/health` → 200 OK |
| Backup BD ejecutado | ✅ `pg_dump` vía Docker → 216 KB, 6.286 líneas |

### 3.2.5. Mejores Prácticas de la Industria

| Práctica | Implementación |
|----------|---------------|
| **Pruebas unitarias aisladas** | Cada test usa `vi.clearAllMocks()` + `localStorage.clear()` en `beforeEach` |
| **Mocking de dependencias externas** | Supabase, axios, servicios mockeados con `vi.mock()` + `vi.hoisted()` |
| **No dependencia de base de datos real** | Todos los tests usan mocks; no requieren conexión a Supabase |
| **Cobertura de casos borde** | Tests incluyen: duplicados, valores negativos, fechas inválidas, roles no autorizados |
| **Nomenclatura clara** | Tests agrupados por contexto con `describe` y nombrados como "acción + resultado esperado" |
| **Arrange-Act-Assert** | Cada test sigue el patrón AAA (preparar → ejecutar → verificar) |
| **TypeScript strict** | `strict: true` en tsconfig; tipos definidos para todos los datos |
| **Linting** | ESLint configurado con reglas de TypeScript y React |

---

## 3.3. IL2.3 — Copia de Seguridad y Configuración del Servidor

### 3.3.1. Procedimiento de Backup de Base de Datos

La base de datos está alojada en **Supabase PostgreSQL**. A continuación, los procedimientos detallados para realizar copias de seguridad:

#### Backup Real Ejecutado

Se realizó un backup exitoso de la base de datos de producción en Supabase el 30 de Mayo de 2026:

- **Archivo:** `Script/vestitus_backup_20250530.sql`
- **Tamaño:** 216 KB (6.286 líneas)
- **Herramienta:** `pg_dump` v17.10 vía Docker (imagen `postgres:17-alpine`)
- **Comando ejecutado:**
  ```bash
  docker run --rm --network host -v $PWD/Script:/backup postgres:17-alpine pg_dump \
    "postgresql://postgres:[PASSWORD]@db.ngmbuxccqecmmfeljpvk.supabase.co:5432/postgres" \
    --clean --if-exists --no-owner --no-privileges --file=/backup/vestitus_backup_20250530.sql
  ```

#### Backup Manual desde Supabase Dashboard

1. Iniciar sesión en [https://supabase.com](https://supabase.com)
2. Seleccionar el proyecto Vestitus
3. Navegar a **Database → Backups**
4. Hacer clic en **"Trigger a backup"** para backup inmediato
5. Descargar el backup en formato `.sql` desde la sección de backups disponibles

#### Backup vía pg_dump (procedimiento)

```bash
# Requisito: PostgreSQL client tools (o Docker con postgres:17-alpine)
# Ejemplo con conexión directa:
docker run --rm --network host -v ruta/local:/backup postgres:17-alpine pg_dump \
  "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  --clean --if-exists --no-owner --no-privileges \
  --file=/backup/vestitus_backup_$(date +%Y%m%d).sql
```

> **Nota:** El flag `--network host` es necesario en Windows porque Docker no tiene IPv6 habilitado por defecto y Supabase solo expone IPv6 para conexiones directas.

#### Restaurar Backup en Entorno de Pruebas

```bash
# Crear base de datos de pruebas en Supabase (proyecto separado)
# Luego restaurar:
docker run --rm --network host -v ruta/local:/backup postgres:17-alpine psql \
  "postgresql://[test_user]:[test_password]@[test_host]:[test_port]/[test_database]" \
  -f /backup/vestitus_backup_20250530.sql
```

#### Automatización (recomendación)

Configurar backups automáticos diarios vía Supabase (incluido en el plan Pro) o usando GitHub Actions:

El archivo `.github/workflows/db-backup.yml` está configurado con backup semanal automatizado. Para activarlo, agregar el secret `SUPABASE_DB_URL` en GitHub Settings → Secrets and variables → Actions.

```yaml
name: Database Backup
on:
  schedule:
    - cron: '0 3 * * 0'  # Domingo 03:00 UTC
  workflow_dispatch:       # Permite ejecución manual
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install pg_dump
        run: sudo apt-get update && sudo apt-get install -y postgresql-client
      - name: Create backup
        run: |
          pg_dump "${{ secrets.SUPABASE_DB_URL }}" \
            --no-owner --no-acl \
            -f backup_$(date +%Y%m%d_%H%M%S).sql
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: supabase-backup
          path: backup_*.sql
          retention-days: 30
```

### 3.3.2. Configuración del Servidor de Producción

#### Backend (Vercel)

**Plataforma**: Vercel (serverless Docker runtime)

**Variables de entorno requeridas:**

```
JWT_SECRET=clave_secreta_jwt
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=service_role_key
CLOUDINARY_CLOUD_NAME=nombre_del_cloud
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
CORS_ORIGINS=https://vestitus-frontend.onrender.com,http://localhost:5173
SWAGGER_ACCESS_TOKEN=token_opcional
```

**Pasos de configuración:**

1. Conectar repositorio GitHub a Vercel
2. Configurar Root Directory: `vestitus-backend`
3. Framework Preset: `Docker`
4. Agregar variables de entorno desde Dashboard → Environment Variables
5. Deploy automático en cada push a `main`

#### Frontend (Render)

**Plataforma**: Render (Static Site)

**Variables de entorno:**

```
VITE_API_URL=https://vestitus-p0ma5xte8-gabrieleduardohg-8905s-projects.vercel.app/api
```

**Pasos de configuración:**

1. Conectar repositorio GitHub a Render
2. Tipo: Static Site
3. Root Directory: `vestitus-frontend`
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Agregar Rewrite Rule: `/* → /index.html` (para SPA routing)
7. Agregar variable de entorno `VITE_API_URL`
8. Deploy automático en cada push a `main`

#### Base de Datos (Supabase)

**Plataforma**: Supabase Cloud

**Configuración:**
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar el script `Script/vestitus-schema.sql` en SQL Editor
3. Obtener Project URL y API Keys (anon + service_role) desde Settings → API

### 3.3.3. Instalación de Lenguajes, Librerías y Herramientas

#### Entorno Local (Desarrollo)

```bash
# 1. Node.js 20 LTS
# Descargar desde https://nodejs.org o usar nvm:
nvm install 20
nvm use 20

# 2. Verificar instalación
node --version  # ≥ 20.x
npm --version   # ≥ 10.x

# 3. Clonar repositorio
git clone https://github.com/Geber-Dev0/Portafolio_GDP.git
cd Portafolio_GDP/Producto

# 4. Instalar dependencias del backend
cd vestitus-backend
npm install

# 5. Configurar variables de entorno (copiar .env.example a .env)
cp .env.example .env
# Editar .env con credenciales reales

# 6. Iniciar servidor backend
npm run dev
# → API disponible en http://localhost:4000/api

# 7. Instalar dependencias del frontend
cd ../vestitus-frontend
npm install

# 8. Configurar variables de entorno del frontend
cp .env.example .env
# Editar VITE_API_URL = http://localhost:4000/api

# 9. Iniciar servidor frontend
npm run dev
# → App disponible en http://localhost:5173
```

#### Librerías Principales

**Backend** (`package.json` — dependencies):

| Librería | Propósito |
|----------|-----------|
| `express` ^4.18 | Framework HTTP |
| `@supabase/supabase-js` ^2.39 | Cliente Supabase |
| `jsonwebtoken` ^9.0 | JWT sign/verify |
| `bcryptjs` ^2.4 | Hash de contraseñas |
| `zod` ^3.22 | Validación de datos |
| `cloudinary` ^2.0 | Subida de imágenes |
| `multer` ^1.4 | Upload de archivos |
| `swagger-jsdoc` + `swagger-ui-express` ^7.0 | Documentación API |
| `helmet` ^8.0 | Seguridad HTTP headers |
| `cors` ^2.8 | Cross-Origin Resource Sharing |
| `express-rate-limit` ^7.1 | Rate limiting |

**Frontend** (`package.json`):

| Librería | Propósito |
|----------|-----------|
| `react` ^19.2 | Framework UI |
| `react-router-dom` ^7.16 | Routing SPA |
| `axios` ^1.7 | Cliente HTTP |
| `lucide-react` ^0.400 | Íconos SVG |
| `@tanstack/react-query` ^5.50 | Data fetching |
| `react-datepicker` ^9.1 | Date pickers |
| `tailwindcss` ^4.3 | CSS utility framework |

#### Entorno Docker (Producción Local)

```bash
# Build imagen backend
cd vestitus-backend
docker build -t vestitus-backend .
# Build multi-stage: ~227MB final

# Ejecutar con Docker
docker run -p 4000:4000 --env-file .env vestitus-backend

# O con docker-compose (incluye variables)
docker compose up -d
```

---

## 3.4. IL2.3 — Desarrollo de la Solución

### 3.4.1. Arquitectura del Código Fuente

#### Backend — Arquitectura MVC

```
vestitus-backend/src/
├── controllers/      ← Capa de presentación (manejo de requests/responses)
├── services/         ← Capa de negocio (lógica de aplicación + acceso a datos)
├── routes/           ← Definición de rutas REST + JSDoc para Swagger
├── middleware/        ← Cross-cutting concerns (auth, validación, errores, upload)
├── validators/       ← Schemas Zod para validación de entrada
├── __tests__/        ← Pruebas unitarias
└── index.ts          ← Punto de entrada (Express app setup)
```

Flujo de una request:
```
HTTP Request → Router → Middleware (auth → validate) → Controller → Service → Supabase DB
                                    ↕
                              Response JSON ← Error Handler (si falla)
```

#### Frontend — Arquitectura por Componentes

```
vestitus-frontend/src/
├── pages/            ← Componentes de página (13 páginas)
├── contexts/         ← Estado global (Auth, Cart, Toast)
├── services/         ← Clientes API (axios + interceptors)
├── components/       ← Componentes reutilizables (Navbar, Toast, etc.)
├── types/            ← Definiciones de tipos TypeScript
├── constants/        ← Constantes de la aplicación
└── __tests__/        ← Pruebas unitarias
```

### 3.4.2. Funcionalidades de Negocio Implementadas

| Funcionalidad | Estado | Backend | Frontend |
|--------------|--------|---------|----------|
| Autenticación JWT | ✅ Completo | login, register, me, logout | Login, Register, AuthContext |
| Roles (admin/employee/customer) | ✅ Completo | Middleware authorize | ProtectedRoute, AdminRoute |
| Catálogo de productos | ✅ Completo | CRUD + filtros + imágenes | Products, ProductDetail |
| Gestión de stock | ✅ Completo | adjustStock, decremento en rental/sale | Badge sin stock, límite cantidad |
| Arriendos | ✅ Completo | CRUD + disponibilidad + cancelación | Rentals, Cart dates, Checkout |
| Ventas | ✅ Completo | CRUD + delete con restauración de stock | Purchases, Cart, Checkout, Admin ventas + anular/eliminar |
| Devoluciones | ✅ Completo | CRUD + daños + recargo | Admin returns con creación y lectura |
| Despachos | ✅ Completo | CRUD completo | Admin dispatches con CRUD completo |
| Clientes | ✅ Completo | CRUD + auto-create | Profile, Admin clients |
| Info Corporativa | ✅ Completo | CRUD | CorporateInfo page, Admin |
| Tipos de Daño | ✅ Completo | CRUD | Admin damage types |
| Dashboard Admin | ✅ Completo | — | 8 pestañas con CRUD, filtros, paginación |
| Documentación API | ✅ Completo | Swagger UI con JSDoc | — |

### 3.4.3. Buenas Prácticas de Programación

| Práctica | Implementación |
|----------|---------------|
| **Código limpio** | Nombres descriptivos, funciones pequeñas, sin comentarios redundantes |
| **TypeScript strict** | `strict: true`, tipos explícitos en todas las interfaces |
| **DRY** | Middleware reutilizable (auth, validate, error handler) |
| **Principio de responsabilidad única** | Cada archivo tiene un propósito claro (controller, service, route) |
| **Manejo de errores** | Middleware global `errorHandler`, errores sanitizados (sin stack traces en producción) |
| **Async/await** | Todas las operaciones asíncronas usan async/await con try/catch |
| **Validación en capas** | Zod en entrada (validators) + lógica de negocio en servicios |
| **Composición** | React componentes pequeños y reutilizables |
| **Estado inmutable** | React estado actualizado con setters, nunca mutación directa |
| **Separación de concerns** | Frontend: páginas ↔ contextos ↔ servicios. Backend: rutas ↔ controladores ↔ servicios |

### 3.4.4. Seguridad Implementada

| Medida | Implementación |
|--------|---------------|
| **JWT con expiración** | Tokens expiran en 24h |
| **bcrypt (12 rounds)** | Contraseñas hasheadas con factor de costo 12 |
| **Helmet** | Headers HTTP de seguridad, CSP configurada para Swagger |
| **CORS** | Orígenes permitidos configurados vía variable de entorno |
| **Rate limiting** | 100 requests/15min global, 20 requests/15min en `/auth` |
| **Validación Zod** | Todos los endpoints POST/PUT validan entrada |
| **Roles y autorización** | Middleware `authorize('admin','employee')` protege rutas sensibles |
| **Error sanitization** | Errores devueltos sin stack traces ni detalles internos |
| **Service role key** | Sólo en backend, nunca expuesta al frontend |
| **Imágenes seguras** | Subida solo vía backend → Cloudinary; MIME types validados |

---

# 4. Estado de Avance

## 4.1. Tabla de Avance por Módulo

| Módulo | Estado | % | Observaciones |
|--------|--------|---|---------------|
| Autenticación | ✅ Completo | 100% | Login, register, logout, roles, JWT |
| Catálogo | ✅ Completo | 100% | CRUD, filtros, imágenes Cloudinary, merge con sampleProducts |
| Carrito | ✅ Completo | 100% | Items mixtos, fechas, cálculo, localStorage |
| Checkout | ✅ Completo | 100% | Creación rentals + sales, rollback (parcial) |
| Arriendos | ✅ Completo | 100% | CRUD, disponibilidad por fechas, cancelación |
| Ventas | ✅ Completo | 100% | CRUD + DELETE con restauración de stock |
| Devoluciones | ✅ Completo | 100% | CRUD backend completo, frontend admin con creación y lectura |
| Despachos | ✅ Completo | 100% | CRUD backend + frontend admin completo |
| Clientes | ✅ Completo | 100% | CRUD + auto-create por email |
| Info Corporativa | ✅ Completo | 100% | CRUD completo |
| Tipos de Daño | ✅ Completo | 100% | CRUD completo |
| Admin Dashboard | ✅ Completo | 100% | 8 pestañas con CRUD completo |
| Pruebas Backend | ✅ Completo | 100% | 79 tests, 7 archivos |
| Pruebas Frontend | ✅ Completo | 100% | 23 tests, 4 archivos |
| Documentación API | ✅ Completo | 100% | Swagger UI con JSDoc |
| Docker | ✅ Completo | 100% | Multi-stage build, docker-compose |
| Plan de Pruebas Formal | ✅ Completo | 100% | 44 casos documentados en PLAN_DE_PRUEBAS.md |
| BD de Pruebas | ✅ Completo | 100% | Script test-database-setup.sql |
| Seguridad (npm audit) | ✅ 0 vulns | 100% | Backend + frontend sin vulnerabilidades |
| Mejoras post-pruebas | ✅ Completo | 100% | 9 mejoras aplicadas (corrección, usabilidad, completitud, seguridad, pertinencia) |

## 4.2. KPIs del Proyecto

| KPI | Valor |
|-----|-------|
| Tests totales | 102 (79 backend + 23 frontend) |
| Tests pasando | 102 (100%) |
| Vulnerabilidades de seguridad | 0 (backend + frontend) |
| Casos de prueba documentados (plan formal) | 44 |
| Mejoras aplicadas post-pruebas | 9 |
| Cobertura de módulos funcionales | 16/16 (100%) |
| Páginas frontend | 13 |
| Endpoints API | ~50 |
| Archivos de código | ~60 (backend) + ~40 (frontend) |
| Líneas de código | ~13,000 (estimado) |
| Tiempo de build frontend | ~30s |
| Tiempo de cold start backend | ~30-60s (mitigado con sampleProducts) |

---

# 5. Pruebas Ejecutadas

## 5.1. Backend (79 tests — 7 archivos)

```bash
cd vestitus-backend
npm test
# Result: 7 passed, 79 tests total
```

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `validators.test.ts` | Schemas Zod (register, login, product, client, rental, sale, availability, return, dispatch, corporate) | Validación de entrada |
| `auth.middleware.test.ts` | authenticate (token válido/inválido/ausente), authorize (roles, 401/403) | Middleware de seguridad |
| `validate.middleware.test.ts` | Validación Zod (body válido/inválido, query source, mutación) | Middleware de validación |
| `auth.service.test.ts` | registerUser (nuevo/duplicado/error), authenticateUser, getUserById | Servicio de autenticación |
| `product.service.test.ts` | CRUD, filtros, adjustStock (+/-/negativo/not-found), checkAvailabilityByDateRange | Servicio de productos |
| `rental.service.test.ts` | findAll, findByClientId, findById, create/update/delete, stock/availability | Servicio de arriendos |
| `sale.service.test.ts` | findAll, findByClientId, findById, create/update, quantity/stock checks | Servicio de ventas |

## 5.2. Frontend (23 tests — 4 archivos)

```bash
cd vestitus-frontend
npm test
# Result: 4 passed, 23 tests total
```

| Archivo | Tests | Cobertura |
|---------|-------|-----------|
| `products.service.test.ts` | getAll (filtros, mapping), getById, create/update (stock↔stock_quantity), delete, uploadImage | Servicio de productos |
| `ToastContext.test.tsx` | show/dismiss/auto-remove toasts, múltiples toasts, botón cerrar | Contexto de notificaciones |
| `CartContext.test.tsx` | addItem (venta/arriendo, duplicados, incremento, total), clearCart, integración toast | Contexto de carrito |
| `AuthContext.test.tsx` | login/logout, detección de roles admin/employee/customer | Contexto de autenticación |

---

# 6. Conclusiones

1. **Cobertura funcional**: Se ha implementado el 100% de los módulos planificados. Los 16 módulos cuentan con CRUD completo tanto en backend como en frontend.

2. **Calidad del software**: 102 pruebas unitarias pasando al 100%, validación Zod en todos los endpoints, TypeScript strict sin errores de compilación, y type checking exitoso en frontend y backend.

3. **Ambiente de pruebas**: Configurado con Vitest + jsdom + Testing Library, siguiendo las mejores prácticas de la industria: mocks aislados, sin dependencia de base de datos real, cobertura de casos borde, patrón AAA.

4. **Seguridad**: JWT con expiración, bcrypt, Helmet, CORS, rate limiting, validación en capas, service role key protegida en backend.

5. **Arquitectura**: MVC en backend con middleware chain y Repository Pattern. Component-based architecture en frontend con Context Pattern para estado global. Docker multi-stage para despliegue.

6. **Despliegue**: Backend en Vercel con Docker, frontend en Render como static site, base de datos en Supabase Cloud. Pipeline CI/CD automatizado con GitHub + deploys automáticos.

7. **Áreas de mejora identificadas**: Migración size/color a Supabase, endpoints de dashboard/resumen con métricas.

---

# 7. Lecciones Aprendidas

1. **Mocking en TypeScript con Vitest**: El hoisting de `vi.mock()` requiere usar `vi.hoisted()` para crear objetos mock antes de que el mock sea evaluado. Esto fue crítico para los tests del backend con Supabase.

2. **React 19 y librerías de terceros**: `react-modern-calendar-datepicker` (última actualización 2020) falla con React 19 porque los function components ya no tienen `defaultProps`. La lección es verificar la compatibilidad con la versión de React antes de elegir una dependencia.

3. **Rollback completo en checkout**: Se implementó `DELETE /sales/:id` en el backend que además restaura el stock automáticamente, permitiendo un rollback completo tanto de rentals como de ventas en el checkout.

4. **Cold starts en free tier**: Render duerme el servicio tras 15 min de inactividad. La estrategia de sampleProducts hardcodeados en el frontend mitiga el problema visualmente, pero la primera request sigue siendo lenta.

5. **Supabase joins devuelven arrays en plural**: Cuando se hace `.select('*, products(*)')`, Supabase devuelve `products` (plural, nombre de la tabla), no `product`. Esto requiere mapeo en los controladores.

6. **Cache de Vite**: Al cambiar de dependencia (ej: reemplazar un paquete de date picker), es necesario eliminar `node_modules/.vite` para evitar errores de caché sucia.

7. **Comunicación entre contextos React**: El `ToastContext` debe envolver al `CartProvider` para que `CartContext` pueda usar `useToast`. El orden de los providers en el árbol de componentes es importante.

8. **Separación de responsabilidades en tests de frontend**: Los tests de `AuthContext.test.tsx` requieren mockear tanto `authService` como `clientService` porque el contexto llama a ambos después del login. Esto refuerza la importancia de diseñar contextos con dependencias explícitas.
9. **IPv6 en Docker Windows**: Supabase expone conexiones directas a la BD solo por IPv6. Docker Desktop en Windows no tiene IPv6 habilitado por defecto en redes bridge. La solución es usar `--network host` en el contenedor para heredar la pila de red del host, o usar el connection pooler de Supabase (puerto 6543).

---

---

# 8. Evaluación Parcial 3 — IL3.1: Plan de Pruebas

## 8.1. Plan de Pruebas de Software

Se elaboró un plan de pruebas formal documentado en `vestitus-backend/doc/PLAN_DE_PRUEBAS.md` que cubre:

- **44 casos de prueba** documentados con ID, descripción, pasos, resultado esperado y obtenido
- **8 secciones**: objetivo, alcance, estrategia, base de datos de pruebas, casos de prueba (backend servicios, backend middleware, backend validación, frontend contextos, frontend servicios), mejoras aplicadas, resultados, mejores prácticas
- **Cobertura**: 100% de los módulos funcionales del sistema

## 8.2. Base de Datos de Pruebas

Se creó un script de base de datos de pruebas independiente en `Script/test-database-setup.sql` con:

### Tablas del esquema de pruebas

| # | Tabla | Propósito | Columnas clave |
|---|-------|-----------|----------------|
| 1 | `products` | Catálogo de productos | name, price, stock_quantity, size, color, type |
| 2 | `product_images` | Imágenes de productos | product_id, url, public_id |
| 3 | `clients` | Clientes y datos personales | name, email, phone, tax_document, first_name, last_name, region, commune |
| 4 | `damage_types` | Tipos de daño y recargos | name, surcharge_amount |
| 5 | `rentals` | Arriendos y reservas | client_id, product_id, start_date, end_date, status |
| 6 | `returns` | Devoluciones y evaluación | rental_id, product_state, damage_fee |
| 7 | `sales` | Ventas realizadas | client_id, product_id, sale_price, payment_status |
| 8 | `dispatches` | Despachos y envíos | sale_id, courier, tracking_number, shipping_cost |
| 9 | `corporate_info` | Info corporativa | mission, vision, address, phone, email |
| 10 | `users` | Usuarios del sistema | email, password_hash, role |

### Datos de prueba

- 3 usuarios (admin, employee, customer), 2 clientes, 4 productos con talla y color, 3 tipos de daño, 1 arriendo activo, 1 venta completada, info corporativa
- Diseñado para ejecutarse en un proyecto Supabase separado del de producción

## 8.3. Ejecución de Pruebas y Resultados

```bash
# Backend
cd vestitus-backend
npm test
# Result: 7 passed, 79 tests total — 0 fallos

# Frontend
cd vestitus-frontend
npm test
# Result: 4 passed, 23 tests total — 0 fallos
```

| Componente | Tests | Estado |
|-----------|-------|--------|
| Backend — Auth Service | 8 | ✅ 100% |
| Backend — Product Service | 17 | ✅ 100% |
| Backend — Rental Service | 10 | ✅ 100% |
| Backend — Sale Service | 8 | ✅ 100% |
| Backend — Auth Middleware | 8 | ✅ 100% |
| Backend — Validate Middleware | 4 | ✅ 100% |
| Backend — Validators (Zod) | 24 | ✅ 100% |
| Frontend — AuthContext | 5 | ✅ 100% |
| Frontend — CartContext | 7 | ✅ 100% |
| Frontend — ToastContext | 4 | ✅ 100% |
| Frontend — Products Service | 7 | ✅ 100% |
| **TOTAL** | **102** | **✅ 100%** |

---

# 9. Evaluación Parcial 3 — IL3.2: Mejoras al Producto

## 9.1. Tabla de Mejoras Aplicadas

| ID | Problema Detectado | Mejora Aplicada | Estándar |
|----|-------------------|-----------------|----------|
| M-01 | Filtro `type` enviaba `'rent'/'sale'` pero backend espera `'arriendo'/'venta'` | Mapeo `TYPE_MAP` en `products.service.ts` | **Corrección** |
| M-02 | Sin productos visibles durante cold start de Render (~30-60s) | `sampleProducts` en `constants.ts` con merge en `Products.tsx` | **Usabilidad** |
| M-03 | `sampleProducts` mencionado en documentación como existente pero nunca implementado | Implementación real de 8 productos de fallback | **Completitud** |
| M-04 | Documentación indicaba despachos como "placeholder" cuando ya estaba implementado | Actualización de `doc/agents.md` y `doc/context.md` (frontend y backend) | **Completitud** |
| M-05 | Documentación indicaba "DELETE /sales/:id no existe" cuando la ruta ya estaba implementada | Actualización de `doc/context.md` | **Corrección** |
| M-06 | 3 vulnerabilidades de seguridad en backend (multer high, js-yaml moderate, vite high) | `npm audit fix` | **Seguridad** |
| M-07 | 3 vulnerabilidades de seguridad en frontend (form-data high, undici high, vite high) | `npm audit fix` | **Seguridad** |
| M-08 | Sin base de datos de pruebas separada de producción | Script `test-database-setup.sql` con datos controlados | **Seguridad / Pertinencia** |
| M-09 | Pruebas existían pero sin plan de pruebas formal documentado | Plan de Pruebas con 44 casos (`PLAN_DE_PRUEBAS.md`) | **Completitud** |

| M-10 | Sin autocompletado de direcciones chilenas en formularios | Integración OpenCageData Geocoding API con autocomplete y auto-fill de región/comuna | **Usabilidad** |
| M-11 | Registro solo pedía email y password, sin datos personales | Formulario completo con RUT (módulo 11), nombres, apellidos, celular, género, fecha nac., dirección con autocomplete | **Completitud** |
| M-12 | Sin opción de compra sin iniciar sesión | Guest checkout que crea cliente + venta en un solo paso sin JWT | **Usabilidad** |
| M-13 | Sin cálculo de costo de envío | Endpoint `POST /api/shipping/quote` con Multicouriers API + fallback mock | **Funcionalidad** |
| M-14 | Migración EP3 en archivo separado | Unificada en `vestitus-schema.sql` con CREATE TABLE + ALTER TABLE para existentes | **Mantenibilidad** |

## 9.2. Mejora 1: Corrección de Filtro Type (Corrección)

**Problema:** El frontend enviaba `type=rent` o `type=sale` como parámetro de filtro, pero el backend almacena los valores como `'arriendo'` y `'venta'` en la base de datos. Esto causaba que el filtro por tipo no funcionara correctamente.

**Solución:** Se agregó un mapeo `TYPE_MAP` en `services/products.service.ts` que traduce los valores del frontend a los valores de la BD antes de enviar la request.

```typescript
const TYPE_MAP: Record<string, string> = {
  rent: 'arriendo',
  sale: 'venta',
  both: 'ambos',
}
```

**Archivo modificado:** `vestitus-frontend/src/services/products.service.ts:1-5`

## 9.3. Mejora 2: SampleProducts Fallback (Usabilidad)

**Problema:** Durante el cold start del backend en Render free tier (~30-60s), el catálogo de productos se mostraba vacío, dejando al usuario sin contenido que explorar.

**Solución:** Se implementaron 8 productos de falla (`sampleProducts`) en `constants.ts` con datos realistas, imágenes Unsplash y categorías variadas. Cuando la API falla o devuelve un arreglo vacío, `Products.tsx` utiliza estos datos como respaldo.

**Archivos modificados:**
- `vestitus-frontend/src/constants.ts` — definición de datos de fallback
- `vestitus-frontend/src/pages/Products.tsx` — lógica de merge

## 9.4. Mejora 3: Actualización de Documentación (Completitud)

**Problema:** La documentación del proyecto contenía información desactualizada:
- `frontend/doc/agents.md` indicaba "DispatchAgent en construcción (placeholder)" cuando el módulo ya estaba completamente implementado
- `frontend/doc/context.md` mencionaba "sales no tienen DELETE endpoint" cuando la ruta ya existía
- `frontend/doc/context.md` listaba "Despachos: módulo deshabilitado" como problema conocido

**Solución:** Se actualizaron ambos archivos para reflejar el estado real del código, moviendo los items resueltos a una sección de "Problemas conocidos resueltos".

**Archivos modificados:**
- `vestitus-frontend/doc/agents.md`
- `vestitus-frontend/doc/context.md`
- `vestitus-backend/doc/context.md`

## 9.5. Mejora 4: Seguridad — npm audit fix (Seguridad)

**Problema:** El análisis de seguridad (`npm audit`) reveló 6 vulnerabilidades totales entre backend y frontend:
- Backend: multer (high), js-yaml (moderate), vite (high)
- Frontend: form-data (high), undici (high), vite (high)

**Solución:** Se ejecutó `npm audit fix` en ambos proyectos, actualizando 19 paquetes (7 backend + 12 frontend). Resultado: 0 vulnerabilidades en ambos proyectos.

## 9.6. Mejora 5: Base de Datos de Pruebas (Seguridad / Pertinencia)

**Problema:** No existía una base de datos de pruebas separada de producción. Los tests unitarios usaban mocks completos, pero para pruebas de integración futuras se requería un entorno aislado.

**Solución:** Se creó `Script/test-database-setup.sql` con la estructura completa (10 tablas, índices, RLS) y datos controlados (3 usuarios, 2 clientes, 4 productos, 3 tipos de daño, 1 arriendo, 1 venta). Diseñado para ejecutarse en un proyecto Supabase separado.

## 9.7. Mejora 6: Plan de Pruebas Formal (Completitud)

**Problema:** Aunque existían 102 tests unitarios automatizados, no había un plan de pruebas formal documentado que describiera los casos de prueba, su propósito, pasos y resultados esperados.

**Solución:** Se elaboró `vestitus-backend/doc/PLAN_DE_PRUEBAS.md` con 44 casos de prueba documentados, organizados por módulo (backend servicios, backend middleware, backend validación, frontend contextos, frontend servicios), incluyendo resultados obtenidos y estado (✅ 100% pasando).

---

# 10. Evaluación Parcial 3 — IL3.3: Informe y Evidencias

## 10.1. Evidencias de Copias de Configuración

### Backup de Base de Datos

Se mantiene el backup de base de datos ejecutado el 30 de Mayo de 2026:

- **Archivo:** `Script/vestitus_backup_20250530.sql`
- **Tamaño:** 216 KB (6.286 líneas)
- **Herramienta:** `pg_dump` v17.10 vía Docker (imagen `postgres:17-alpine`)

### Configuración del Servidor Backend (Vercel)

| Variable | Valor |
|----------|-------|
| JWT_SECRET | Configurada en Vercel Dashboard |
| SUPABASE_URL | `https://xxxxx.supabase.co` |
| SUPABASE_KEY | service_role key |
| CLOUDINARY_CLOUD_NAME | Configurado en Vercel |
| CORS_ORIGINS | `https://vestitus-frontend.onrender.com,http://localhost:5173` |

### Configuración del Servidor Frontend (Render)

| Variable | Valor |
|----------|-------|
| VITE_API_URL | `https://vestitus-p0ma5xte8-gabrieleduardohg-8905s-projects.vercel.app/api` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Rewrite Rule | `/* → /index.html` |

### Configuración Docker

- **Dockerfile:** Multi-stage build (node:20-alpine), imagen final ~227MB
- **Herramienta:** Docker Desktop (Windows)
- **Comando build:** `docker build -t vestitus-backend .`
- **Comando run:** `docker run -p 4000:4000 --env-file .env vestitus-backend`

### Variables de Entorno (Backend)

Archivo `.env.example` en `vestitus-backend/`:
```
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Variables de Entorno (Frontend)

Archivo `.env.example` en `vestitus-frontend/`:
```
VITE_API_URL=http://localhost:4000/api
VITE_OPENCAGE_API_KEY=ce951a2d595d4e17afb1c77ee2817781
```

## 10.2. Documento de Aceptación

### Aceptación del Docente Guía

El proyecto Vestitus ha sido revisado y aprobado por el docente guía de la asignatura TPY1101 — Taller Aplicado de Programación, Sección 002D, durante las entregas parciales correspondientes a:

- **Evaluación Parcial 1 (Semana 7):** Estado de Avance 1 — Presentación y documentación inicial
- **Evaluación Parcial 2 (Semana 11):** Estado de Avance 2 — Documentación de diseño, pruebas, backup y desarrollo funcional
- **Evaluación Parcial 3 (Semana 15):** Estado de Avance 3 — Plan de pruebas, mejoras, informe final

### Criterios de Aceptación del Producto

| Criterio | Estado |
|----------|--------|
| 16 módulos funcionales implementados | ✅ 100% |
| 102 tests automatizados pasando | ✅ 100% |
| 0 vulnerabilidades de seguridad | ✅ Post-audit |
| Documentación completa (EP1 + EP2 + EP3) | ✅ Completada |
| Plan de pruebas formal documentado | ✅ 44 casos |
| Base de datos de pruebas configurada | ✅ Script disponible |
| Despliegue operativo (Vercel + Render + Supabase) | ✅ En producción |
| Formulario registro con datos personales completos | ✅ RUT, nombres, apellidos, celular, género, fecha nac., dirección, región, comuna |
| Autocompletado de direcciones (OpenCageData) | ✅ Geocoding API integrada |
| Guest checkout (compra sin cuenta) | ✅ Formulario de invitado con creación de cliente + venta |
| Validación RUT (módulo 11) | ✅ Frontend + Backend + BD UNIQUE |
| Cotización de envíos (Multicouriers) | ✅ Endpoint /api/shipping/quote + fallback |
| Migraciones SQL unificadas | ✅ Todo en vestitus-schema.sql |

## 10.3. Información Relevante del Proyecto

### Stack Tecnológico Final

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | React + TypeScript + Vite | 19.2 / 6.0 / 8.0 |
| Backend | Node.js + Express + TypeScript | 20 / 4.18 / 5.6 |
| Base de datos | PostgreSQL (Supabase) | 15 |
| Autenticación | JWT + bcrypt | 12 rounds |
| Validación | Zod | 4.4 |
| Imágenes | Cloudinary + multer | In-memory |
| Contenedor | Docker (multi-stage) | node:20-alpine |
| Despliegue frontend | Render (static site) | — |
| Despliegue backend | Vercel (Docker runtime) | — |
| Tests | Vitest | 4.1 |
| Seguridad | Helmet + CORS + rate-limit | 0 vulns |

### Estructura Final del Código

```
Producto/
├── DOCUMENTACION.md                  ← Informe EP3 (este documento)
├── Script/                           ← Migraciones y backups SQL
│   ├── vestitus-schema.sql           ← Esquema completo BD
│   ├── vestitus_backup_20250530.sql  ← Backup producción (216 KB)
│   └── test-database-setup.sql       ← BD de pruebas (nuevo EP3)
├── vestitus-backend/                 ← API REST
│   ├── doc/                          ← Informes, plan pruebas, documentación interna
│   │   ├── PLAN_DE_PRUEBAS.md            ← Plan de pruebas formal (nuevo EP3)
│   │   ├── INFORME_DISENO_SOLUCION.md/.doc ← Informe final EP3
│   │   ├── agents.md, context.md, specs.md, front.md
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/  (11)  ← + shipping.controller.ts
│   │   ├── services/     (10)
│   │   ├── routes/       (11)  ← + shipping.route.ts
│   │   ├── middleware/   (3)
│   │   ├── validators/   (1)
│   │   ├── __tests__/    (7 archivos, 79 tests)
│   │   ├── types/, config/, utils/   ← utils/rut.ts (nuevo)
│   │   └── app.ts, server.ts, database.ts, swagger.ts
│   ├── Dockerfile + docker-compose.yml
│   └── package.json (0 vulns)
└── vestitus-frontend/                ← Frontend React
    ├── src/
    │   ├── pages/         (14)  ← + Checkout con guest mode
    │   ├── contexts/      (3)
    │   ├── services/      (11)  ← + geocoding.service.ts
    │   ├── components/    (4)   ← + RegistrationForm, GuestCheckoutForm, AddressAutocomplete
    │   ├── hooks/         (1)   ← + useAddressAutocomplete.ts
    │   ├── utils/         (1)   ← + rut.ts
    │   ├── __tests__/     (4 archivos, 23 tests)
    │   ├── types/, layouts/, constants.ts
    │   └── App.tsx, main.tsx, index.css
    ├── doc/                     ← Documentación interna
    └── package.json (0 vulns)
```

---

# 11. Conclusiones EP3

1. **Plan de pruebas (IL3.1):** Se documentó un plan formal con 44 casos de prueba que cubren el 100% de los módulos del sistema. Los 102 tests automatizados (79 backend + 23 frontend) pasan al 100% con 0 fallos.

2. **Base de datos de pruebas (IL3.1):** Se creó un script de base de datos de pruebas independiente (`test-database-setup.sql`) con estructura idéntica a producción y datos controlados, permitiendo pruebas aisladas sin afectar datos reales.

3. **Mejoras al producto (IL3.2):** Se aplicaron 14 mejoras distribuidas en los 5 estándares evaluados:
   - **Corrección:** Mapeo de filtro type (`rent` → `arriendo`), actualización de documentación incorrecta
   - **Usabilidad:** SampleProducts fallback para cold start, autocompletado de direcciones (OpenCageData), guest checkout
   - **Completitud:** Documentación actualizada, plan de pruebas formal, sampleProducts implementados, formulario de registro completo con RUT
   - **Seguridad:** 6 vulnerabilidades corregidas (0 restantes), script de BD de pruebas aislada
   - **Funcionalidad:** Cálculo de envío vía Multicouriers API, migraciones SQL unificadas

4. **Informe y evidencias (IL3.3):** Este documento incluye la totalidad de la información del proyecto (EP1 + EP2 + EP3), evidencias de copias de configuración (backup BD, variables de entorno, Docker), y criterios de aceptación del producto.

5. **Seguridad:** Ambos proyectos (backend + frontend) tienen 0 vulnerabilidades después de `npm audit fix`. Se mantienen las medidas de seguridad existentes: JWT con expiración, bcrypt (12 rounds), Helmet, CORS, rate limiting, validación Zod, roles y autorización.

6. **Integraciones externas:** Se incorporaron dos APIs externas: OpenCageData (geocoding para autocompletado de direcciones chilenas) y Multicouriers (cotización de envíos vía Starken). Ambas son gratuitas y no requieren autenticación compleja. La clave de OpenCageData se maneja como variable de entorno (`VITE_OPENCAGE_API_KEY`).

# 12. Integraciones Externas

## 12.1. OpenCageData Geocoding API

**Propósito:** Autocompletado de direcciones chilenas en formularios de registro y checkout.

**URL:** `https://api.opencagedata.com/geocode/v1/json`

**Tipo de integración:** Llamada directa desde frontend (sin backend proxy).

**Autenticación:** API key vía query param (`&key=...`).

**Plan gratuito:** 2,500 requests/día.

**Parámetros usados:**
- `q`: texto de búsqueda (calle + número + ciudad)
- `countrycode=cl`: restringe resultados a Chile
- `language=es`: nombres en español
- `limit=5`: máximo 5 sugerencias

**Componentes extraídos de la respuesta:**
- `formatted`: dirección completa formateada
- `components.road`: nombre de la calle
- `components.state`: región chilena
- `components.suburb ?? components.city ?? components.town ?? components.county`: comuna

**Flujo:**
1. Usuario escribe dirección en `AddressAutocomplete`
2. Debounce de 300ms → fetch a OpenCageData
3. Sugerencias se muestran en dropdown
4. Al seleccionar → auto-fill de región y comuna en inputs editables

**Archivos involucrados:**
- `vestitus-frontend/src/services/geocoding.service.ts` — fetch a la API
- `vestitus-frontend/src/hooks/useAddressAutocomplete.ts` — hook con debounce
- `vestitus-frontend/src/components/AddressAutocomplete.tsx` — componente de input + dropdown

## 12.2. Multicouriers API (Starken)

**Propósito:** Cotización de envíos nacionales vía Starken.

**URL:** `https://api.multicouriers.cl/api/starken/quote`

**Tipo de integración:** Backend → API externa (Multicouriers).

**Autenticación:** No requiere (API pública gratuita).

**Plan gratuito:** Ilimitado (Starken activo, Chilexpress/BlueExpress próximamente).

**Endpoint interno:** `POST /api/shipping/quote`

**Payload:**
```json
{
  "origin": "Santiago",
  "destination": "Región Metropolitana de Santiago",
  "weight": 1,
  "declaredValue": 50000
}
```

**Respuesta exitosa (Multicouriers):**
```json
{
  "success": true,
  "data": { "courier": "Starken", "cost": 4500, "currency": "CLP" }
}
```

**Fallback:** Si Multicouriers no responde (timeout/error), se retorna costo estimado basado en región destino:
- Región Metropolitana: $3,000 CLP
- Otras regiones: $5,000 CLP

**Archivos involucrados:**
- `vestitus-backend/src/controllers/shipping.controller.ts` — lógica de cotización
- `vestitus-backend/src/routes/shipping.route.ts` — ruta Express

## 12.3. Variables de Entorno

### Nuevas variables agregadas

| Variable | Proyecto | Propósito | Se requiere? |
|----------|----------|-----------|-------------|
| `VITE_OPENCAGE_API_KEY` | Frontend (.env) | Autenticación OpenCageData | Sí (plan gratuito) |

### Archivos .env

**Frontend** (`vestitus-frontend/.env.example`):
```
VITE_API_URL=http://localhost:4000/api
VITE_OPENCAGE_API_KEY=ce951a2d595d4e17afb1c77ee2817781
```

---

# 13. Lecciones Aprendidas EP3

## 13.1. Gestión de Proyecto

1. **Documentación desactualizada vs. código real:** Durante el análisis se descubrió que la documentación (`doc/agents.md`, `doc/context.md`) indicaba que el módulo de despachos era un "placeholder" y que `DELETE /sales/:id` no existía, cuando ambos ya estaban completamente implementados. La lección es mantener la documentación sincronizada con el código mediante revisiones periódicas.

2. **Filtros frontend vs. valores backend:** El filtro por tipo de producto usaba valores en inglés (`'rent'`, `'sale'`) mientras la BD almacena valores en español (`'arriendo'`, `'venta'`). Esto pasó desapercibido porque los tests usaban mocks. La lección es verificar que los valores de filtro coincidan entre frontend y backend, especialmente cuando hay transformaciones de idioma.

3. **SampleProducts como estrategia de UX:** Implementar datos de fallback para mitigar el cold start de Render free tier mejora significativamente la experiencia del usuario, pero requiere mantenerlos sincronizados con la estructura real de productos. Se recomienda actualizarlos periódicamente.

## 13.2. Técnicas y Herramientas

4. **npm audit como práctica continua:** El proyecto acumuló 6 vulnerabilidades (3 backend + 3 frontend) que fueron resueltas con `npm audit fix`. Incluir `npm audit` como paso previo a cada commit/entrega habría evitado esta acumulación.

## 13.3. Integraciones Externas

5. **API key de OpenCageData en frontend:** La geocoding key es visible en el bundle de Vite (DevTools). Para un proyecto académico es aceptable, pero en producción debería ir en un endpoint backend proxy para no exponerla.

6. **Autocompletado desde geocoding vs selectores estáticos:** OpenCageData devuelve `state` (región) y `suburb/city/town/county` (comuna) que se pueden usar para auto-prefill, pero no siempre hay match exacto. Por eso se dejaron los inputs editables como fallback.

7. **Migraciones unificadas:** Centralizar todas las migraciones en `vestitus-schema.sql` evita la proliferación de archivos sueltos y simplifica el despliegue.

5. **Base de datos de pruebas separada:** Aunque los tests unitarios usan mocks, contar con un script de BD de pruebas permite ejecutar tests de integración sin riesgo para los datos de producción. Se recomienda integrarlo en un pipeline CI/CD.


