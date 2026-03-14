import { Router } from 'express';
import * as busImageController from '../controllers/busImageController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', busImageController.getAll);
router.get('/:id', busImageController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busImageController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busImageController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busImageController.remove);

export default router;
