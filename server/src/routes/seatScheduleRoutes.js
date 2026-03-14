import { Router } from 'express';
import * as seatScheduleController from '../controllers/seatScheduleController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

// Specific routes BEFORE /:id to avoid param catching
router.get('/schedule/:scheduleId', seatScheduleController.getByScheduleId);
router.get('/:id', seatScheduleController.getById);
router.post('/', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatScheduleController.create);
router.put('/:id', authenticate, requireRole('ADMIN', 'BUS_COMPANY'), seatScheduleController.update);

export default router;
