import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { dispatchSchema } from '@validators/index';
import * as dispatchController from '@controllers/dispatch.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'employee'), dispatchController.getDispatches);
router.get('/:id', authenticate, authorize('admin', 'employee'), dispatchController.getDispatchById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(dispatchSchema), dispatchController.createDispatch);
router.put('/:id', authenticate, authorize('admin', 'employee'), dispatchController.updateDispatch);

export default router;
