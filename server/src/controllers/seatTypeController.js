import * as seatTypeModel from '../models/seatTypeModel.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await seatTypeModel.findAll();

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const seatType = await seatTypeModel.findById(req.params.id);
    if (!seatType) {
      return res.status(404).json({ success: false, message: 'Seat type not found' });
    }

    res.json({ success: true, data: seatType, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const seatType = await seatTypeModel.create(req.body);

    res.status(201).json({ success: true, data: seatType, message: 'Seat type created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await seatTypeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat type not found' });
    }

    const seatType = await seatTypeModel.update(req.params.id, req.body);

    res.json({ success: true, data: seatType, message: 'Seat type updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await seatTypeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat type not found' });
    }

    await seatTypeModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Seat type deleted successfully' });
  } catch (err) {
    next(err);
  }
};
