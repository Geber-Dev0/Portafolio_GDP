import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { saleSchema } from '@validators/index';
import * as saleController from '@controllers/sale.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'employee'), saleController.getSales);
router.get('/:id', authenticate, authorize('admin', 'employee'), saleController.getSaleById);
router.post('/', authenticate, validate(saleSchema), saleController.createSale);
router.put('/:id', authenticate, authorize('admin', 'employee'), saleController.updateSale);

export default router;
