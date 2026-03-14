import { Router } from 'express';
import * as seatPositionController from '../controllers/seatPositionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', seatPositionController.getAll);
router.get('/:id', seatPositionController.getById);
router.post('/bulk', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatPositionController.bulkCreate);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatPositionController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatPositionController.update);
router.delete('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatPositionController.remove);

export default router;
