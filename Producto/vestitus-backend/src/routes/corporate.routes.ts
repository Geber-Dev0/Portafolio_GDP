import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { corporateSchema } from '@validators/index';
import * as corporateController from '@controllers/corporate.controller';

const router = Router();

router.get('/', corporateController.getCorporateInfo);
router.put('/:id', authenticate, authorize('admin', 'employee'), validate(corporateSchema), corporateController.updateCorporateInfo);

export default router;
