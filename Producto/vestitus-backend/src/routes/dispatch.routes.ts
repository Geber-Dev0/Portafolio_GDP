import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { dispatchSchema } from '@validators/index';
import * as dispatchController from '@controllers/dispatch.controller';

const router = Router();

/**
 * @swagger
 * /dispatches:
 *   get:
 *     tags: [Despachos]
 *     summary: Listar despachos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de despachos
 *   post:
 *     tags: [Despachos]
 *     summary: Crear despacho
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sale_id: { type: string, format: uuid }
 *               rental_id: { type: string, format: uuid }
 *               courier: { type: string }
 *               tracking_number: { type: string }
 *               shipping_cost: { type: number }
 *               shipping_address: { type: string }
 *               status: { type: string }
 *     responses:
 *       201:
 *         description: Despacho creado
 */
router.get('/', authenticate, authorize('admin', 'employee'), dispatchController.getDispatches);
router.get('/:id', authenticate, authorize('admin', 'employee'), dispatchController.getDispatchById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(dispatchSchema), dispatchController.createDispatch);
router.put('/:id', authenticate, authorize('admin', 'employee'), dispatchController.updateDispatch);
router.delete('/:id', authenticate, authorize('admin'), dispatchController.deleteDispatch);

export default router;
