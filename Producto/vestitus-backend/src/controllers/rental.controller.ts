import { Request, Response } from 'express';
import * as rentalService from '@services/rental.service';

export const getRentals = async (_req: Request, res: Response) => {
  try {
    const rentals = await rentalService.findRentals();
    res.json({ success: true, data: rentals });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener arriendos' });
  }
};

export const getRentalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rental = await rentalService.findRentalById(id);
    res.json({ success: true, data: rental });
  } catch {
    res.status(404).json({ success: false, message: 'Arriendo no encontrado' });
  }
};

export const createRental = async (req: Request, res: Response) => {
  try {
    const rental = await rentalService.createRental(req.body);
    res.status(201).json({ success: true, data: rental });
  } catch {
    res.status(500).json({ success: false, message: 'Error al crear arriendo' });
  }
};

export const updateRental = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rental = await rentalService.updateRental(id, req.body);
    res.json({ success: true, data: rental });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar arriendo' });
  }
};

export const deleteRental = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await rentalService.deleteRental(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al eliminar arriendo' });
  }
};
