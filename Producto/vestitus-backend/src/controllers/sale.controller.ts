import { Request, Response } from 'express';
import * as saleService from '@services/sale.service';
import * as clientService from '@services/client.service';

export const getSelfSales = async (req: Request, res: Response) => {
  try {
    const client = await clientService.findClientByEmail(req.user!.email);
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const sales = await saleService.findSalesByClientId(client.id);
    const mapped = sales.map(s => ({
      ...s,
      product: s.products ? { ...s.products, images: (s.products as any).product_images || [] } : s.products,
    }));
    res.json({ success: true, data: mapped });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener ventas' });
  }
};

export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await saleService.findSales();
    const mapped = sales.map(s => ({
      ...s,
      product: s.products ? { ...s.products, images: (s.products as any).product_images || [] } : s.products,
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
      product: sale.products ? { ...sale.products, images: (sale.products as any).product_images || [] } : sale.products,
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

export const deleteSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await saleService.deleteSale(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al eliminar venta' });
  }
};
