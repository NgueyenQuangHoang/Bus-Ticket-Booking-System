import { Router } from 'express';
import * as popularRouteController from '../controllers/popularRouteController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', popularRouteController.getAll);
router.get('/:id', popularRouteController.getById);
router.post('/', authenticate, requireRole('ADMIN'), popularRouteController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), popularRouteController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), popularRouteController.remove);

export default router;
