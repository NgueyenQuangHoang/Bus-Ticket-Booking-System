import { Router } from 'express';
import * as bannerController from '../controllers/bannerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', bannerController.getAll);
router.get('/:id', bannerController.getById);
router.post('/', authenticate, requireRole('ADMIN'), bannerController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), bannerController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), bannerController.remove);

export default router;
