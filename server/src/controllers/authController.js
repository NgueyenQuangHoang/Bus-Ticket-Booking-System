import * as userModel from '../models/userModel.js';
import pool from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { generateUUID } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, id } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'first_name, last_name, email and password are required' });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashed = await hashPassword(password);

    const user = await userModel.create({
      id: id || undefined,
      first_name,
      last_name,
      email,
      phone: phone || null,
      password: hashed,
    });

    // Assign USER role (role_id = '1')
    await pool.query(
      'INSERT INTO user_role (id, user_id, role_id) VALUES (?, ?, ?)',
      [generateUUID(), user.id, '1']
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
    const role = roles.length > 0 ? roles[0].role_name : 'USER';
    const bus_company_id = user.bus_company_id || null;

    const token = generateToken({ id: user.id, email: user.email, role, bus_company_id });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword, role, bus_company_id },
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
    const bus_company_id = user.bus_company_id || null;

    const token = generateToken({ id: user.id, email: user.email, role, bus_company_id });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword, role, bus_company_id },
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
