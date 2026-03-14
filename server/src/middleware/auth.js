import { verifyToken } from '../utils/jwt.js';
import pool from '../config/db.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch user with role
    const [users] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.bus_company_id, u.status,
              r.role_name as role
       FROM users u
       LEFT JOIN user_role ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (!users.length || users[0].status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
