import * as busImageModel from '../models/busImageModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_id: req.query.bus_id || undefined,
    };

    const result = await busImageModel.findAll(filters);

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
    const image = await busImageModel.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Bus image not found' });
    }

    res.json({ success: true, data: image, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const image = await busImageModel.create(req.body);

    res.status(201).json({ success: true, data: image, message: 'Bus image created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await busImageModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus image not found' });
    }

    const image = await busImageModel.update(req.params.id, req.body);

    res.json({ success: true, data: image, message: 'Bus image updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await busImageModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus image not found' });
    }

    await busImageModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Bus image deleted successfully' });
  } catch (err) {
    next(err);
  }
};
