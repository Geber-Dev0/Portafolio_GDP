import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import config from '@config';
import routes from '@routes/index';
import swaggerSpec from '@swagger';
import { errorHandler } from '@utils/error.middleware';
import { swaggerAuth, swaggerLogin } from '@middleware/swagger-auth.middleware';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  }
}));

const corsOrigins = config.nodeEnv === 'production'
  ? config.corsOrigins.split(',').map(s => s.trim())
  : '*';

if (corsOrigins === '*') {
  console.warn('[ropa-backend] CORS: permitting all origins (development mode)');
}

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, intenta de nuevo en 15 minutos' }
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de autenticación' }
});
app.use('/api/auth', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

const swaggerOptions = {
  swaggerOptions: { locale: 'es' },
  customSiteTitle: 'Vestitus API - Documentación'
};

app.post('/api/docs/auth', swaggerLogin);
app.use('/api/docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
app.get('/api/docs.json', swaggerAuth, (_req, res) => res.json(swaggerSpec));

app.use('/api', routes);

app.use(errorHandler);

export default app;
