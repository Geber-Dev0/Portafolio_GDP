import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { clientSchema } from '@validators/index';
import * as clientController from '@controllers/client.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'employee'), clientController.getClients);
router.get('/:id', authenticate, authorize('admin', 'employee'), clientController.getClientById);
router.post('/', authenticate, validate(clientSchema), clientController.createClient);
router.put('/:id', authenticate, authorize('admin', 'employee'), clientController.updateClient);
router.delete('/:id', authenticate, authorize('admin'), clientController.deleteClient);

export default router;
