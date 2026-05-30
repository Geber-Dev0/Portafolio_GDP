import { Request, Response } from 'express';
import * as rentalService from '@services/rental.service';
import * as clientService from '@services/client.service';
import * as productService from '@services/product.service';

export const cancelSelfRental = async (req: Request, res: Response) => {
  try {
    const client = await clientService.findClientByEmail(req.user!.email);
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const { id } = req.params;
    const rental = await rentalService.findRentalById(id);
    if (rental.client_id !== client.id) return res.status(403).json({ success: false, message: 'No tienes permiso para cancelar este arriendo' });
    if (rental.status !== 'active') return res.status(400).json({ success: false, message: 'Solo se pueden cancelar arriendos activos' });
    await rentalService.updateRental(id, { status: 'cancelled' });
    await productService.adjustStock(rental.product_id, 1);
    res.json({ success: true, message: 'Arriendo cancelado correctamente' });
  } catch {
    res.status(500).json({ success: false, message: 'Error al cancelar arriendo' });
  }
};

export const getSelfRentals = async (req: Request, res: Response) => {
  try {
    const client = await clientService.findClientByEmail(req.user!.email);
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const rentals = await rentalService.findRentalsByClientId(client.id);
    const mapped = rentals.map(r => ({
      ...r,
      product: r.product ? { ...r.product, images: (r.product as any).product_images || [] } : r.product,
    }));
    res.json({ success: true, data: mapped });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener arriendos' });
  }
};

export const getRentals = async (_req: Request, res: Response) => {
  try {
    const rentals = await rentalService.findRentals();
    const mapped = rentals.map(r => ({
      ...r,
      product: r.product ? { ...r.product, images: (r.product as any).product_images || [] } : r.product,
    }));
    res.json({ success: true, data: mapped });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener arriendos' });
  }
};

export const getRentalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rental = await rentalService.findRentalById(id);
    const mapped = {
      ...rental,
      product: rental.product ? { ...rental.product, images: (rental.product as any).product_images || [] } : rental.product,
    };
    res.json({ success: true, data: mapped });
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
