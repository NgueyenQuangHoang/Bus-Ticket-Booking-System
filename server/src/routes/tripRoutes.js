import { Router } from 'express';
import * as tripController from '../controllers/tripController.js';

const router = Router();

router.get('/search', tripController.search);

export default router;
