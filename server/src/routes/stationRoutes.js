import { Router } from 'express';
import * as stationController from '../controllers/stationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', stationController.getAll);
router.get('/:id', stationController.getById);
router.post('/', authenticate, requireRole('ADMIN'), stationController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), stationController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), stationController.remove);

export default router;
