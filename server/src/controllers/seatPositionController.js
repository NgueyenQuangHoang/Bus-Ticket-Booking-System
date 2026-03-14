import * as seatPositionModel from '../models/seatPositionModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      layout_id: req.query.layout_id || undefined,
      floor: req.query.floor !== undefined ? parseInt(req.query.floor) : undefined,
    };

    const result = await seatPositionModel.findAll(filters);

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
    const position = await seatPositionModel.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ success: false, message: 'Seat position not found' });
    }

    res.json({ success: true, data: position, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const position = await seatPositionModel.create(req.body);

    res.status(201).json({ success: true, data: position, message: 'Seat position created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await seatPositionModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat position not found' });
    }

    const position = await seatPositionModel.update(req.params.id, req.body);

    res.json({ success: true, data: position, message: 'Seat position updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await seatPositionModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat position not found' });
    }

    await seatPositionModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Seat position deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const bulkCreate = async (req, res, next) => {
  try {
    const { positions } = req.body;

    if (!positions || !Array.isArray(positions) || positions.length === 0) {
      return res.status(400).json({ success: false, message: 'positions must be a non-empty array' });
    }

    const data = await seatPositionModel.bulkCreate(positions);

    res.status(201).json({ success: true, data, message: 'Seat positions created successfully' });
  } catch (err) {
    next(err);
  }
};
