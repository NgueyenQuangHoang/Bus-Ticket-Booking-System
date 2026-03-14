import * as vehicleTypeModel from '../models/vehicleTypeModel.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await vehicleTypeModel.findAll();

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const vehicleType = await vehicleTypeModel.findById(req.params.id);
    if (!vehicleType) {
      return res.status(404).json({ success: false, message: 'Vehicle type not found' });
    }

    res.json({ success: true, data: vehicleType, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const vehicleType = await vehicleTypeModel.create(req.body);

    res.status(201).json({ success: true, data: vehicleType, message: 'Vehicle type created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await vehicleTypeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle type not found' });
    }

    const vehicleType = await vehicleTypeModel.update(req.params.id, req.body);

    res.json({ success: true, data: vehicleType, message: 'Vehicle type updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await vehicleTypeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle type not found' });
    }

    await vehicleTypeModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Vehicle type deleted successfully' });
  } catch (err) {
    next(err);
  }
};
