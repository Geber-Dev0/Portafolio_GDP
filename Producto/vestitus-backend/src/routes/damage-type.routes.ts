import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import * as damageTypeController from '@controllers/damage-type.controller';
import { validate } from '@middleware/validate.middleware';
import { damageTypeSchema } from '@validators/index';

const router = Router();

router.get('/', damageTypeController.getDamageTypes);
router.post('/', authenticate, authorize('admin', 'employee'), validate(damageTypeSchema), damageTypeController.createDamageType);
router.put('/:id', authenticate, authorize('admin', 'employee'), damageTypeController.updateDamageType);
router.delete('/:id', authenticate, authorize('admin'), damageTypeController.deleteDamageType);

export default router;
