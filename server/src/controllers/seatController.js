import * as seatModel from '../models/seatModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_id: req.query.bus_id || undefined,
      status: req.query.status || undefined,
    };

    const result = await seatModel.findAll(filters);

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
    const seat = await seatModel.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }

    res.json({ success: true, data: seat, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const seat = await seatModel.create(req.body);

    res.status(201).json({ success: true, data: seat, message: 'Seat created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await seatModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }

    const seat = await seatModel.update(req.params.id, req.body);

    res.json({ success: true, data: seat, message: 'Seat updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await seatModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }

    await seatModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Seat deleted successfully' });
  } catch (err) {
    next(err);
  }
};
