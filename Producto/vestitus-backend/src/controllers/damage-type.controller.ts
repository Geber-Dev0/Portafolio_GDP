import { Request, Response } from 'express';
import * as damageTypeService from '@services/damage-type.service';

export const getDamageTypes = async (_req: Request, res: Response) => {
  try {
    const damageTypes = await damageTypeService.getDamageTypes();
    res.json({ success: true, data: damageTypes });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch damage types' });
  }
};

export const createDamageType = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const damageType = await damageTypeService.createDamageType(payload);
    res.status(201).json({ success: true, data: damageType });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create damage type' });
  }
};

export const updateDamageType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const damageType = await damageTypeService.updateDamageType(id, payload);
    res.json({ success: true, data: damageType });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update damage type' });
  }
};

export const deleteDamageType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await damageTypeService.deleteDamageType(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete damage type' });
  }
};
