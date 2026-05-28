import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { corporateSchema } from '@validators/index';
import * as corporateController from '@controllers/corporate.controller';

const router = Router();

/**
 * @swagger
 * /corporate-info:
 *   get:
 *     tags: [Info Corporativa]
 *     summary: Obtener información corporativa
 *     responses:
 *       200:
 *         description: Información corporativa
 *   put:
 *     tags: [Info Corporativa]
 *     summary: Actualizar información corporativa
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mission: { type: string }
 *               vision: { type: string }
 *               objectives: { type: string }
 *               address: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Información actualizada
 */
router.get('/', corporateController.getCorporateInfo);
router.put('/:id', authenticate, authorize('admin', 'employee'), validate(corporateSchema), corporateController.updateCorporateInfo);

export default router;
