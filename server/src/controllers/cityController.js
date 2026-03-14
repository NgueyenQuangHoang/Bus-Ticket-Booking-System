import * as cityModel from '../models/cityModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || undefined,
      region: req.query.region || undefined,
    };

    const result = await cityModel.findAll(filters);

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
    const city = await cityModel.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.json({ success: true, data: city, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const city = await cityModel.create(req.body);

    res.status(201).json({ success: true, data: city, message: 'City created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await cityModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    const city = await cityModel.update(req.params.id, req.body);

    res.json({ success: true, data: city, message: 'City updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await cityModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    await cityModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'City deleted successfully' });
  } catch (err) {
    next(err);
  }
};
