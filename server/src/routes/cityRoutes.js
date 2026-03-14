import { Router } from 'express';
import * as cityController from '../controllers/cityController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', cityController.getAll);
router.get('/:id', cityController.getById);
router.post('/', authenticate, requireRole('ADMIN'), cityController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), cityController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), cityController.remove);

export default router;
