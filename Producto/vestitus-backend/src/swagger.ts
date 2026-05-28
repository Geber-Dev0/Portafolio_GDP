import swaggerJsdoc from 'swagger-jsdoc';

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
      { url: 'https://portafolio-gdp.onrender.com/api', description: 'Producción' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
