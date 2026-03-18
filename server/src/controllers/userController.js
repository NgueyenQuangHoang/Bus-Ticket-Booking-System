import * as userModel from '../models/userModel.js';
import { hashPassword } from '../utils/password.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || undefined,
      status: req.query.status || undefined,
    };

    const result = await userModel.findAll(filters);

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = req.body;

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await userModel.create(data);

    if (data.role_id && user) {
      await userModel.updateUserRoles(user.id, [data.role_id]);
    }

    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await userModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const data = { ...req.body };
    if (data.password) {
      data.password = await hashPassword(data.password);
    } else {
      delete data.password;
    }

    const user = await userModel.update(req.params.id, data);

    res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await userModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await userModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    const roles = await userModel.findUserRoles(req.params.id);

    res.json({ success: true, data: roles, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const updateUserRoles = async (req, res, next) => {
  try {
    const role_ids = req.body.role_ids ?? req.body.roleIds;

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({ success: false, message: 'role_ids must be an array' });
    }

    const roles = await userModel.updateUserRoles(req.params.id, role_ids);

    res.json({ success: true, data: roles, message: 'User roles updated successfully' });
  } catch (err) {
    next(err);
  }
};
