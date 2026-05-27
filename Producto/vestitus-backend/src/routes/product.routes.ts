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

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticate, authorize('admin', 'employee'), validate(productSchema), productController.createProduct);
router.put('/:id', authenticate, authorize('admin', 'employee'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);
router.post('/:id/images', authenticate, authorize('admin', 'employee'), upload.single('image'), productController.uploadProductImage);
router.delete('/:id/images/:imageId', authenticate, authorize('admin', 'employee'), productController.deleteProductImage);

export default router;
