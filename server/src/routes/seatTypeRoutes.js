import { Router } from 'express';
import * as seatTypeController from '../controllers/seatTypeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', seatTypeController.getAll);
router.get('/:id', seatTypeController.getById);
router.post('/', authenticate, requireRole('ADMIN'), seatTypeController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), seatTypeController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), seatTypeController.remove);

export default router;
