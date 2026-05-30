import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const isDev = __filename.endsWith('.ts');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vestitus API',
      version: '1.0.0',
      description: 'API REST para plataforma de arriendo y venta de vestuario'
    },
    servers: [
      { url: 'http://localhost:4000/api', description: 'Desarrollo' },
      { url: 'https://vestitus-p0ma5xte8-gabrieleduardohg-8905s-projects.vercel.app/api', description: 'Producción' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido al iniciar sesión en /auth/login'
        }
      }
    }
  },
  apis: isDev
    ? ['./src/routes/*.ts']
    : [path.join(__dirname, 'routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
