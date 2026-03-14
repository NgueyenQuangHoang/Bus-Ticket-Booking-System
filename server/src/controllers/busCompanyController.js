import * as busCompanyModel from '../models/busCompanyModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || undefined,
      status: req.query.status || undefined,
    };

    const result = await busCompanyModel.findAll(filters);

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
    const company = await busCompanyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Bus company not found' });
    }

    res.json({ success: true, data: company, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const company = await busCompanyModel.create(req.body);

    res.status(201).json({ success: true, data: company, message: 'Bus company created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await busCompanyModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus company not found' });
    }

    const company = await busCompanyModel.update(req.params.id, req.body);

    res.json({ success: true, data: company, message: 'Bus company updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await busCompanyModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bus company not found' });
    }

    await busCompanyModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Bus company deleted successfully' });
  } catch (err) {
    next(err);
  }
};
