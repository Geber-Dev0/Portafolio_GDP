import { Request, Response } from 'express';
import * as dispatchService from '@services/dispatch.service';

export const getDispatches = async (_req: Request, res: Response) => {
  try {
    const dispatches = await dispatchService.findDispatches();
    res.json({ success: true, data: dispatches });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener despachos' });
  }
};

export const getDispatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dispatch = await dispatchService.findDispatchById(id);
    res.json({ success: true, data: dispatch });
  } catch {
    res.status(404).json({ success: false, message: 'Despacho no encontrado' });
  }
};

export const createDispatch = async (req: Request, res: Response) => {
  try {
    const dispatch = await dispatchService.createDispatch(req.body);
    res.status(201).json({ success: true, data: dispatch });
  } catch {
    res.status(500).json({ success: false, message: 'Error al crear despacho' });
  }
};

export const updateDispatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dispatch = await dispatchService.updateDispatch(id, req.body);
    res.json({ success: true, data: dispatch });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar despacho' });
  }
};

export const deleteDispatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await dispatchService.deleteDispatch(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al eliminar despacho' });
  }
};
