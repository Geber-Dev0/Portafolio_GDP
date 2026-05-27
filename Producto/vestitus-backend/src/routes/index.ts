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

const router = Router();

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

router.get('/', (_req, res) => {
  res.json({ message: 'Ropa backend API is running' });
});

export default router;
