import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);
router.get('/:id/roles', userController.getUserRoles);
router.put('/:id/roles', userController.updateUserRoles);

export default router;
