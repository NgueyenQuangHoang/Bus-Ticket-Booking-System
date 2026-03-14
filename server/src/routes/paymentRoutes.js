import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', authenticate, requireRole('ADMIN'), paymentController.getAll);
router.get('/:ticketId/detail', authenticate, paymentController.getByTicketId);

export default router;
