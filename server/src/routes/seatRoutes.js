import { Router } from 'express';
import * as seatController from '../controllers/seatController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', seatController.getAll);
router.get('/:id', seatController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatController.remove);

export default router;
