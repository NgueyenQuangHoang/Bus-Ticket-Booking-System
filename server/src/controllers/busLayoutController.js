import * as busLayoutModel from '../models/busLayoutModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_company_id: req.query.bus_company_id || undefined,
      is_template: req.query.is_template !== undefined ? req.query.is_template : undefined,
      search: req.query.search || undefined,
    };

    const result = await busLayoutModel.findAll(filters);

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
    const layout = await busLayoutModel.findById(req.params.id);
    if (!layout) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    res.json({ success: true, data: layout, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const layout = await busLayoutModel.create(req.body);

    res.status(201).json({ success: true, data: layout, message: 'Bus layout created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await busLayoutModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    const layout = await busLayoutModel.update(req.params.id, req.body);

    res.json({ success: true, data: layout, message: 'Bus layout updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await busLayoutModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus layout not found' });
    }

    await busLayoutModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Bus layout deleted successfully' });
  } catch (err) {
    next(err);
  }
};
