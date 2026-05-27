import { Request, Response } from 'express';
import { checkAvailabilityByDateRange } from '@services/product.service';

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { product_id, start_date, end_date } = req.body;
    const result = await checkAvailabilityByDateRange(product_id, start_date, end_date);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al verificar disponibilidad' });
  }
};
