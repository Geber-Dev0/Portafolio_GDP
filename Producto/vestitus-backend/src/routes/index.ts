import { Router } from 'express';
import { validate } from '@middleware/validate.middleware';
import { availabilitySchema } from '@validators/index';
import { checkAvailability } from '@controllers/availability.controller';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import clientRoutes from './client.routes';
import rentalRoutes from './rental.routes';
import returnRoutes from './return.routes';
import saleRoutes from './sale.routes';
import dispatchRoutes from './dispatch.routes';
import corporateRoutes from './corporate.routes';
import damageTypeRoutes from './damage-type.routes';
import shippingRoutes from './shipping.route';

const router = Router();

/**
 * @swagger
 * /check-availability:
 *   post:
 *     tags: [Productos]
 *     summary: Verificar disponibilidad de un producto en un rango de fechas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, start_date, end_date]
 *             properties:
 *               product_id: { type: string, format: uuid }
 *               start_date: { type: string, format: date }
 *               end_date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Resultado de disponibilidad
 */
router.post('/check-availability', validate(availabilitySchema), checkAvailability);

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/rentals', rentalRoutes);
router.use('/returns', returnRoutes);
router.use('/sales', saleRoutes);
router.use('/dispatches', dispatchRoutes);
router.use('/damage-types', damageTypeRoutes);
router.use('/corporate-info', corporateRoutes);
router.use('/shipping', shippingRoutes);

router.get('/', (_req, res) => {
  res.json({ message: 'Ropa backend API is running' });
});

export default router;
