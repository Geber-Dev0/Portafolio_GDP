import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { rentalSchema } from '@validators/index';
import * as rentalController from '@controllers/rental.controller';

const router = Router();

/**
 * @swagger
 * /rentals:
 *   get:
 *     tags: [Arriendos]
 *     summary: Listar arriendos
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de arriendos
 *   post:
 *     tags: [Arriendos]
 *     summary: Crear arriendo
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client_id, product_id, start_date, end_date]
 *             properties:
 *               client_id: { type: string, format: uuid }
 *               product_id: { type: string, format: uuid }
 *               start_date: { type: string, format: date }
 *               end_date: { type: string, format: date }
 *               period_type: { type: string, enum: [days, weeks, months] }
 *               rental_price: { type: number }
 *               appointment_date: { type: string, format: date }
 *               appointment_time: { type: string }
 *     responses:
 *       201:
 *         description: Arriendo creado
 */
router.get('/', authenticate, authorize('admin', 'employee'), rentalController.getRentals);
router.get('/:id', authenticate, authorize('admin', 'employee'), rentalController.getRentalById);
router.post('/', authenticate, validate(rentalSchema), rentalController.createRental);
router.put('/:id', authenticate, authorize('admin', 'employee'), rentalController.updateRental);
router.delete('/:id', authenticate, authorize('admin'), rentalController.deleteRental);

export default router;
