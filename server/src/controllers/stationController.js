import * as stationModel from '../models/stationModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      city_id: req.query.city_id || undefined,
      search: req.query.search || undefined,
    };

    const result = await stationModel.findAll(filters);

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
    const station = await stationModel.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    res.json({ success: true, data: station, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const station = await stationModel.create(req.body);

    res.status(201).json({ success: true, data: station, message: 'Station created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await stationModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    const station = await stationModel.update(req.params.id, req.body);

    res.json({ success: true, data: station, message: 'Station updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await stationModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    await stationModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Station deleted successfully' });
  } catch (err) {
    next(err);
  }
};
