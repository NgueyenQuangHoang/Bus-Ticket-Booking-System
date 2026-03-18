import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, role_name FROM roles ORDER BY role_name');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
