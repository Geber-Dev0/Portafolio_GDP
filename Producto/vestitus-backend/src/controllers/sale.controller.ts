import { Request, Response } from 'express';
import * as saleService from '@services/sale.service';

export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await saleService.findSales();
    const mapped = sales.map(s => ({
      ...s,
      product: s.product ? { ...s.product, images: (s.product as any).product_images || [] } : s.product,
    }));
    res.json({ success: true, data: mapped });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener ventas' });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await saleService.findSaleById(id);
    const mapped = {
      ...sale,
      product: sale.product ? { ...sale.product, images: (sale.product as any).product_images || [] } : sale.product,
    };
    res.json({ success: true, data: mapped });
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
