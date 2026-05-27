import { Request, Response } from 'express';
import * as saleService from '@services/sale.service';

export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await saleService.findSales();
    res.json({ success: true, data: sales });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener ventas' });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await saleService.findSaleById(id);
    res.json({ success: true, data: sale });
  } catch {
    res.status(404).json({ success: false, message: 'Venta no encontrada' });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const sale = await saleService.createSale(req.body);
    res.status(201).json({ success: true, data: sale });
  } catch {
    res.status(500).json({ success: false, message: 'Error al crear venta' });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await saleService.updateSale(id, req.body);
    res.json({ success: true, data: sale });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar venta' });
  }
};
