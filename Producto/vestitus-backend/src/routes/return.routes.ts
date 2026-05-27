import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { returnSchema } from '@validators/index';
import * as returnController from '@controllers/return.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'employee'), returnController.getReturns);
router.get('/:id', authenticate, authorize('admin', 'employee'), returnController.getReturnById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(returnSchema), returnController.createReturn);

export default router;
