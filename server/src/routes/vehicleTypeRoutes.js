import { Router } from 'express';
import * as vehicleTypeController from '../controllers/vehicleTypeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', vehicleTypeController.getAll);
router.get('/:id', vehicleTypeController.getById);
router.post('/', authenticate, requireRole('ADMIN'), vehicleTypeController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), vehicleTypeController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), vehicleTypeController.remove);

export default router;
