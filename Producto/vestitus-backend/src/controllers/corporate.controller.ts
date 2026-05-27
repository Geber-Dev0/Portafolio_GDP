import { Request, Response } from 'express';
import * as corporateService from '@services/corporate.service';

export const getCorporateInfo = async (_req: Request, res: Response) => {
  try {
    const info = await corporateService.findCorporateInfo();
    res.json({ success: true, data: info });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener información corporativa' });
  }
};

export const updateCorporateInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const info = await corporateService.upsertCorporateInfo(id, req.body);
    res.json({ success: true, data: info });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar información corporativa' });
  }
};
