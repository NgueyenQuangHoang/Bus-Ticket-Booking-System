import * as popularRouteModel from '../models/popularRouteModel.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await popularRouteModel.findAll();

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const route = await popularRouteModel.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Popular route not found' });
    }

    res.json({ success: true, data: route, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const route = await popularRouteModel.create(req.body);

    res.status(201).json({ success: true, data: route, message: 'Popular route created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await popularRouteModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Popular route not found' });
    }

    const route = await popularRouteModel.update(req.params.id, req.body);

    res.json({ success: true, data: route, message: 'Popular route updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await popularRouteModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Popular route not found' });
    }

    await popularRouteModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Popular route deleted successfully' });
  } catch (err) {
    next(err);
  }
};
