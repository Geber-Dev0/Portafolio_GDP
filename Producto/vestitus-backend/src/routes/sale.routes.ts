import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { saleSchema } from '@validators/index';
import * as saleController from '@controllers/sale.controller';

const router = Router();

/**
 * @swagger
 * /sales:
 *   get:
 *     tags: [Ventas]
 *     summary: Listar ventas
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de ventas
 *   post:
 *     tags: [Ventas]
 *     summary: Registrar venta
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client_id, product_id, sale_price]
 *             properties:
 *               client_id: { type: string, format: uuid }
 *               product_id: { type: string, format: uuid }
 *               sale_price: { type: number }
 *               payment_method: { type: string }
 *               shipping_cost: { type: number }
 *     responses:
 *       201:
 *         description: Venta registrada
 */
router.get('/', authenticate, authorize('admin', 'employee'), saleController.getSales);
router.get('/:id', authenticate, authorize('admin', 'employee'), saleController.getSaleById);
router.post('/', authenticate, validate(saleSchema), saleController.createSale);
router.put('/:id', authenticate, authorize('admin', 'employee'), saleController.updateSale);
router.delete('/:id', authenticate, authorize('admin'), saleController.deleteSale);

export default router;
