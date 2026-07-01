# Vestitus Frontend

Frontend React para plataforma de arriendo y venta de vestuario (PYME).

## Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Estilos**: Tailwind CSS 4
- **Routing**: react-router-dom 7
- **HTTP Client**: Axios
- **Testing**: Vitest 4 (23 tests)
- **Calidad**: ESLint + TypeScript strict mode

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```env
VITE_API_URL=https://vestitus-api.vercel.app/api
VITE_OPENCAGE_API_KEY=ce951a2d595d4e17afb1c77ee2817781
```

## Inicio rápido

```bash
npm install
npm run dev        # desarrollo con HMR en :5173
npm run build      # build producción → dist/
npm run preview    # previsualizar build local
npm test           # ejecutar tests
```

## Rutas principales

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Home | Público |
| `/products` | Catálogo | Público |
| `/products/:id` | Detalle producto | Público |
| `/cart` | Carrito de compras | Público |
| `/checkout` | Checkout (auth + guest) | Público |
| `/register` | Registro de usuario | Público |
| `/login` | Inicio de sesión | Público |
| `/profile` | Perfil e historial | Customer |
| `/admin` | Panel de administración | Admin/Employee |
| `/corporate-info` | Información corporativa | Público |

## Estructura del proyecto

```
vestitus-frontend/
├── src/
│   ├── pages/             ← Páginas por ruta (14)
│   ├── contexts/          ← Estado global: Auth, Cart, Toast
│   ├── components/        ← Componentes reutilizables
│   ├── services/          ← API calls (axios) (11)
│   ├── hooks/             ← Custom hooks
│   ├── utils/             ← Utilidades (RUT validation)
│   ├── types/             ← Interfaces TypeScript
│   ├── layouts/           ← Layouts compartidos
│   ├── data/              ← Datos estáticos
│   └── __tests__/         ← Tests unitarios Vitest (23 tests)
├── public/
├── scripts/               ← Scripts de utilidad
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## Funcionalidades principales

- **Catálogo** con filtros por categoría, tipo y disponibilidad
- **Carrito** mixto (arriendo + compra simultáneos)
- **Checkout** con o sin registro (guest checkout)
- **Registro** completo con RUT (módulo 11), datos personales y dirección
- **Autocompletado de direcciones** vía OpenCageData Geocoding API
- **Cotización de envío** multicourier (Starken + fallback regional)
- **Panel admin** con CRUD completo de productos, clientes, arriendos, ventas, devoluciones y despachos
