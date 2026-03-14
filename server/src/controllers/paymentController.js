import * as paymentModel from '../models/paymentModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || undefined,
      status: req.query.status || undefined,
      payment_method: req.query.payment_method || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined,
    };

    const result = await paymentModel.findAll(filters);

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

export const getByTicketId = async (req, res, next) => {
  try {
    const payments = await paymentModel.findByTicketId(req.params.ticketId);

    res.json({ success: true, data: payments, message: 'OK' });
  } catch (err) {
    next(err);
  }
};
