import * as userModel from '../models/userModel.js';
import pool from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'first_name, last_name, email and password are required' });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashed = await hashPassword(password);
    const full_name = `${first_name} ${last_name}`;

    const user = await userModel.create({
      full_name,
      email,
      phone: phone || null,
      password: hashed,
    });

    // Assign USER role (role_id = '1')
    const now = nowMySQL();
    await pool.query(
      'INSERT INTO user_roles (id, user_id, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [generateUUID(), user.id, '1', now, now]
    );

    const token = generateToken({ id: user.id, email: user.email, role: 'USER', bus_company_id: null });

    res.status(201).json({
      success: true,
      data: { token, user },
      message: 'Registration successful',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const roles = await userModel.findUserRoles(user.id);
    const roleNames = roles.map(r => r.role_name);
    const role = roleNames[0] || 'USER';

    // Check if user is associated with a bus company
    const [companyRows] = await pool.query(
      'SELECT bus_company_id FROM user_bus_companies WHERE user_id = ? LIMIT 1',
      [user.id]
    ).catch(() => [[]]);
    const bus_company_id = companyRows.length > 0 ? companyRows[0].bus_company_id : null;

    const token = generateToken({ id: user.id, email: user.email, role, bus_company_id });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword },
      message: 'Login successful',
    });
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const roles = await userModel.findUserRoles(user.id);
    const roleNames = roles.map(r => r.role_name);

    if (!roleNames.includes('ADMIN') && !roleNames.includes('BUS_COMPANY')) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin or Bus Company role required' });
    }

    const role = roleNames.includes('ADMIN') ? 'ADMIN' : 'BUS_COMPANY';

    const [companyRows] = await pool.query(
      'SELECT bus_company_id FROM user_bus_companies WHERE user_id = ? LIMIT 1',
      [user.id]
    ).catch(() => [[]]);
    const bus_company_id = companyRows.length > 0 ? companyRows[0].bus_company_id : null;

    const token = generateToken({ id: user.id, email: user.email, role, bus_company_id });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword },
      message: 'Admin login successful',
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.json({ success: true, data: null, message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const roles = await userModel.findUserRoles(user.id);

    res.json({
      success: true,
      data: { ...user, roles },
      message: 'OK',
    });
  } catch (err) {
    next(err);
  }
};
