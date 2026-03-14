import { Router } from 'express';
import * as routeController from '../controllers/routeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', routeController.getAll);
router.get('/:id', routeController.getById);
router.post('/', authenticate, requireRole('ADMIN'), routeController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), routeController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), routeController.remove);

export default router;
