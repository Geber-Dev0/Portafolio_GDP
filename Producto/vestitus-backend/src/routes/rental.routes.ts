import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { rentalSchema } from '@validators/index';
import * as rentalController from '@controllers/rental.controller';

const router = Router();

router.get('/', authenticate, authorize('admin', 'employee'), rentalController.getRentals);
router.get('/:id', authenticate, authorize('admin', 'employee'), rentalController.getRentalById);
router.post('/', authenticate, validate(rentalSchema), rentalController.createRental);
router.put('/:id', authenticate, authorize('admin', 'employee'), rentalController.updateRental);
router.delete('/:id', authenticate, authorize('admin'), rentalController.deleteRental);

export default router;
