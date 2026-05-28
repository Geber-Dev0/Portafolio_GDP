import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import * as damageTypeController from '@controllers/damage-type.controller';
import { validate } from '@middleware/validate.middleware';
import { damageTypeSchema } from '@validators/index';

const router = Router();

/**
 * @swagger
 * /damage-types:
 *   get:
 *     tags: [Tipos de Daño]
 *     summary: Listar tipos de daño
 *     responses:
 *       200:
 *         description: Lista de tipos de daño
 *   post:
 *     tags: [Tipos de Daño]
 *     summary: Crear tipo de daño
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surcharge_amount]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               surcharge_amount: { type: number }
 *     responses:
 *       201:
 *         description: Tipo de daño creado
 */
router.get('/', damageTypeController.getDamageTypes);
router.post('/', authenticate, authorize('admin', 'employee'), validate(damageTypeSchema), damageTypeController.createDamageType);
router.put('/:id', authenticate, authorize('admin', 'employee'), damageTypeController.updateDamageType);
router.delete('/:id', authenticate, authorize('admin'), damageTypeController.deleteDamageType);

export default router;
