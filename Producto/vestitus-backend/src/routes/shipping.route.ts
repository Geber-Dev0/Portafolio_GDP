import { Router } from 'express';
import { getShippingQuote } from '@controllers/shipping.controller';

const router = Router();

router.post('/quote', getShippingQuote);

export default router;
