import * as routeModel from '../models/routeModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      departure_station_id: req.query.departure_station_id || undefined,
      arrival_station_id: req.query.arrival_station_id || undefined,
      search: req.query.search || undefined,
    };

    const result = await routeModel.findAll(filters);

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
    const route = await routeModel.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    res.json({ success: true, data: route, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const route = await routeModel.create(req.body);

    res.status(201).json({ success: true, data: route, message: 'Route created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await routeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const route = await routeModel.update(req.params.id, req.body);

    res.json({ success: true, data: route, message: 'Route updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await routeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    await routeModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Route deleted successfully' });
  } catch (err) {
    next(err);
  }
};
