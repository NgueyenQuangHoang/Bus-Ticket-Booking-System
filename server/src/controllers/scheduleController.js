import * as scheduleModel from '../models/scheduleModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      route_id: req.query.route_id || undefined,
      bus_id: req.query.bus_id || undefined,
      status: req.query.status || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined,
      departure_city_id: req.query.departure_city_id || undefined,
      arrival_city_id: req.query.arrival_city_id || undefined,
      bus_company_id: req.query.bus_company_id || undefined,
    };

    const result = await scheduleModel.findAll(filters);

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
    const schedule = await scheduleModel.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    res.json({ success: true, data: schedule, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const schedule = await scheduleModel.create(req.body);

    res.status(201).json({ success: true, data: schedule, message: 'Schedule created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await scheduleModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const schedule = await scheduleModel.update(req.params.id, req.body);

    res.json({ success: true, data: schedule, message: 'Schedule updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await scheduleModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    await scheduleModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Schedule deleted successfully' });
  } catch (err) {
    next(err);
  }
};
