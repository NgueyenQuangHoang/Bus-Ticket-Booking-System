import { Router } from 'express';
import * as paymentProviderController from '../controllers/paymentProviderController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/', paymentProviderController.getAll);
router.get('/:id', paymentProviderController.getById);
router.post('/', paymentProviderController.create);
router.put('/:id', paymentProviderController.update);
router.delete('/:id', paymentProviderController.remove);

export default router;
