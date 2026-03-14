import { Router } from 'express';
import * as busLayoutController from '../controllers/busLayoutController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', busLayoutController.getAll);
router.get('/:id', busLayoutController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busLayoutController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busLayoutController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), busLayoutController.remove);

export default router;
