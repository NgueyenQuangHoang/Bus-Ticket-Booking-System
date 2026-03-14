import { Router } from 'express';
import * as cancellationPolicyController from '../controllers/cancellationPolicyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', cancellationPolicyController.getAll);
router.get('/:id', cancellationPolicyController.getById);
router.post('/', authenticate, requireRole('ADMIN'), cancellationPolicyController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), cancellationPolicyController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), cancellationPolicyController.remove);

export default router;
