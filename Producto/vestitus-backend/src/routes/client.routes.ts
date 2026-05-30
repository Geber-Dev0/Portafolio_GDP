import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { clientSchema } from '@validators/index';
import * as clientController from '@controllers/client.controller';

const router = Router();

/**
 * @swagger
 * /clients:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar clientes
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     tags: [Clientes]
 *     summary: Crear cliente
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               client_type: { type: string, enum: [natural, empresa, agrupacion] }
 *               tax_document: { type: string }
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.get('/', authenticate, authorize('admin', 'employee'), clientController.getClients);
router.get('/self', authenticate, clientController.getSelfClient);
router.get('/:id', authenticate, authorize('admin', 'employee'), clientController.getClientById);
router.post('/', authenticate, validate(clientSchema), clientController.createClient);
router.put('/:id', authenticate, authorize('admin', 'employee'), clientController.updateClient);
router.delete('/:id', authenticate, authorize('admin'), clientController.deleteClient);

export default router;
