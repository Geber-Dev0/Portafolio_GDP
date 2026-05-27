import { Request, Response } from 'express';
import * as clientService from '@services/client.service';

export const getClients = async (_req: Request, res: Response) => {
  try {
    const clients = await clientService.findClients();
    res.json({ success: true, data: clients });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener clientes' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await clientService.findClientById(id);
    res.json({ success: true, data: client });
  } catch {
    res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json({ success: true, data: client });
  } catch {
    res.status(500).json({ success: false, message: 'Error al crear cliente' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await clientService.updateClient(id, req.body);
    res.json({ success: true, data: client });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar cliente' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await clientService.deleteClient(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al eliminar cliente' });
  }
};
