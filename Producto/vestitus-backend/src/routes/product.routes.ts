import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { productSchema } from '@validators/index';
import * as productController from '@controllers/product.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPEG, PNG, WebP o AVIF'));
    }
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos (con filtros)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por categoría
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: Filtrar por tipo (arriendo/venta)
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Lista de productos
 *   post:
 *     tags: [Productos]
 *     summary: Crear producto
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               type: { type: string, enum: [arriendo, venta] }
 *               price: { type: number }
 *               stock_quantity: { type: integer }
 *               condition: { type: string }
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(productSchema), productController.createProduct);
router.put('/:id', authenticate, authorize('admin', 'employee'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);
router.post('/:id/images', authenticate, authorize('admin', 'employee'), upload.single('image'), productController.uploadProductImage);
router.delete('/:id/images/:imageId', authenticate, authorize('admin', 'employee'), productController.deleteProductImage);

export default router;
