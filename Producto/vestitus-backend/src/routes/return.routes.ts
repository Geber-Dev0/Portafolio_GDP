import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { returnSchema } from '@validators/index';
import * as returnController from '@controllers/return.controller';

const router = Router();

/**
 * @swagger
 * /returns:
 *   get:
 *     tags: [Devoluciones]
 *     summary: Listar devoluciones
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de devoluciones
 *   post:
 *     tags: [Devoluciones]
 *     summary: Registrar devolución
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rental_id, product_state]
 *             properties:
 *               rental_id: { type: string, format: uuid }
 *               product_state: { type: string, enum: [good, damaged, lost] }
 *               damage_type_id: { type: string, format: uuid }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Devolución registrada
 */
router.get('/', authenticate, authorize('admin', 'employee'), returnController.getReturns);
router.get('/:id', authenticate, authorize('admin', 'employee'), returnController.getReturnById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(returnSchema), returnController.createReturn);

export default router;
