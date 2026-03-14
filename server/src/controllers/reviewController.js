import * as reviewModel from '../models/reviewModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_id: req.query.bus_id || undefined,
      bus_company_id: req.query.bus_company_id || undefined,
      rating: req.query.rating ? parseInt(req.query.rating) : undefined,
      search: req.query.search || undefined,
    };

    const result = await reviewModel.findAll(filters);

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

export const getAllAdmin = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      bus_id: req.query.bus_id || undefined,
      bus_company_id: req.query.bus_company_id || undefined,
      user_id: req.query.user_id || undefined,
      rating: req.query.rating ? parseInt(req.query.rating) : undefined,
      search: req.query.search || undefined,
    };

    const result = await reviewModel.findAll(filters);

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
    const review = await reviewModel.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, data: review, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id,
    };

    const review = await reviewModel.create(data);

    res.status(201).json({ success: true, data: review, message: 'Review created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await reviewModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const review = await reviewModel.update(req.params.id, req.body);

    res.json({ success: true, data: review, message: 'Review updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await reviewModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await reviewModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};
