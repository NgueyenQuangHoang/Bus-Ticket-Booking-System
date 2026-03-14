import { Router } from 'express';
import * as busController from '../controllers/busController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', busController.getAll);
router.get('/:id', busController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busController.remove);

export default router;
