# Vestitus - Plataforma Web de Arriendo y Venta de Vestuario

**Grupo 3** | TPY1101 - Taller Aplicado de Programación | Duoc UC

## Integrantes

| Nombre | Rol |
|--------|-----|
| Gabriel Hermosilla | Analista de negocio / Coordinador |
| Deyanira Leyton | Analista Funcional / Diseño UX-UI |
| Priscila Calderón | Arquitecto cloud / Backend |

## Estructura del proyecto

```
Portafolio/
├── Documentación/           ← Informe, UML, WireFrame, MER, Gantt, presentaciones
│   ├── VestitusEA1.pdf
│   └── VestitusEA1.pptx
├── Gestión/                 ← Documentos de gestión del proyecto
│   ├── 1.1.2 Documento de registro de definición e identificación del proyecto.docx
│   └── Integrantes.txt
├── Producto/                ← Código fuente y scripts
│   ├── Script/
│   │   └── vestitus-schema.sql    ← BD: tablas, P.A. y datos de prueba
│   ├── vestitus-backend/          ← API REST (Node.js + Express + TypeScript)
│   │   ├── src/                   ← Código fuente (controladores, servicios, rutas)
│   │   ├── Dockerfile             ← Build multi-stage para deploy
│   │   ├── docker-compose.yml     ← Entorno local con Docker
│   │   └── package.json
│   └── vestitus-frontend/         ← Frontend (React) - próxima fase
├── .gitignore
└── README.md
```

## Stack tecnológico

| Componente | Tecnología |
|------------|-----------|
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT + bcrypt |
| Imágenes | Cloudinary |
| Contenedor | Docker (node:20-alpine) |
| Deploy backend | Render (Docker runtime) |
| Deploy frontend | Vercel (próxima fase) |
| Control de versiones | GitHub |


## Enlaces

- Repositorio: [https://github.com/Geber-Dev0/Portafolio_GDP.git](https://github.com/Geber-Dev0/Portafolio_GDP.git)
