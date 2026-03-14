import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

// Specific routes BEFORE /:id to avoid param catching
router.get('/my-tickets', authenticate, ticketController.getMyTickets);
router.get('/find', ticketController.findTicket);
router.get('/', authenticate, requireRole('ADMIN'), ticketController.getAll);
router.get('/:id', authenticate, ticketController.getById);
router.patch('/:id/cancel', authenticate, ticketController.cancelTicket);

export default router;
