import { Router } from 'express';
import * as busCompanyController from '../controllers/busCompanyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.get('/', busCompanyController.getAll);
router.get('/:id', busCompanyController.getById);
router.post('/', authenticate, requireRole('ADMIN'), busCompanyController.create);
router.put('/:id', authenticate, requireRole('ADMIN'), busCompanyController.update);
router.delete('/:id', authenticate, requireRole('ADMIN'), busCompanyController.remove);

export default router;
