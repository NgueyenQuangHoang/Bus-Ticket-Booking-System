import { Router } from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

// Specific routes BEFORE /:id to avoid param catching
router.get('/all', authenticate, requireRole('ADMIN'), reviewController.getAllAdmin);
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);
router.post('/', authenticate, reviewController.create);
router.patch('/:id', authenticate, reviewController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), reviewController.remove);

export default router;
