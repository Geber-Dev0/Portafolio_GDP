import { Request, Response } from 'express';
import * as productService from '@services/product.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string | undefined,
      type: req.query.type as string | undefined,
      is_available: req.query.available !== undefined ? req.query.available === 'true' : undefined
    };
    const products = await productService.findProducts(filters);
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.findProductById(id);
    res.json({ success: true, data: product });
  } catch {
    res.status(404).json({ success: false, message: 'Producto no encontrado' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Error al crear producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    res.json({ success: true, data: product });
  } catch {
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    return res.status(400).json({ success: false, message: 'La imagen es requerida' });
  }

  try {
    const { id } = req.params;
    const { uploadImage } = await import('@services/integration.service');
    const result = await uploadImage(file.buffer, file.originalname);
    const image = await productService.createProductImage(id, result.url, result.publicId);
    return res.status(201).json({ success: true, data: image });
  } catch {
    return res.status(500).json({ success: false, message: 'Error al subir imagen' });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await productService.findProductImageById(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    }

    const { deleteImage } = await import('@services/integration.service');
    await deleteImage(image.public_id);
    await productService.deleteProductImageRecord(imageId);

    return res.json({ success: true, data: { imageId } });
  } catch {
    return res.status(500).json({ success: false, message: 'Error al eliminar imagen' });
  }
};
