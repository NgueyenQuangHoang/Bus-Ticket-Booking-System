import * as busModel from '../models/busModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_company_id: req.query.bus_company_id || undefined,
      vehicle_type_id: req.query.vehicle_type_id || undefined,
      search: req.query.search || undefined,
    };

    const result = await busModel.findAll(filters);

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
    const bus = await busModel.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    res.json({ success: true, data: bus, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const bus = await busModel.create(req.body);
    res.status(201).json({ success: true, data: bus, message: 'Bus created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await busModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const bus = await busModel.update(req.params.id, req.body);
    res.json({ success: true, data: bus, message: 'Bus updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await busModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    await busModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Bus deleted successfully' });
  } catch (err) {
    next(err);
  }
};
