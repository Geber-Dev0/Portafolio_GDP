import { Request, Response } from 'express';
import * as returnService from '@services/return.service';

export const getReturns = async (_req: Request, res: Response) => {
  try {
    const returns = await returnService.findReturns();
    res.json({ success: true, data: returns });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener devoluciones' });
  }
};

export const getReturnById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ret = await returnService.findReturnById(id);
    res.json({ success: true, data: ret });
  } catch {
    res.status(404).json({ success: false, message: 'Devolución no encontrada' });
  }
};

export const createReturn = async (req: Request, res: Response) => {
  try {
    const ret = await returnService.createReturn(req.body);
    res.status(201).json({ success: true, data: ret });
  } catch {
    res.status(500).json({ success: false, message: 'Error al registrar devolución' });
  }
};
