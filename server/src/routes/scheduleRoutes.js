import { Router } from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), scheduleController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), scheduleController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), scheduleController.remove);

export default router;
