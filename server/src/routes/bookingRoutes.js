import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/hold-seats', bookingController.holdSeats);
router.post('/create', bookingController.createBooking);

export default router;
