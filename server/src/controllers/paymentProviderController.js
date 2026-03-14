import * as paymentProviderModel from '../models/paymentProviderModel.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await paymentProviderModel.findAll();

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const provider = await paymentProviderModel.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Payment provider not found' });
    }

    res.json({ success: true, data: provider, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const provider = await paymentProviderModel.create(req.body);

    res.status(201).json({ success: true, data: provider, message: 'Payment provider created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await paymentProviderModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Payment provider not found' });
    }

    const provider = await paymentProviderModel.update(req.params.id, req.body);

    res.json({ success: true, data: provider, message: 'Payment provider updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await paymentProviderModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Payment provider not found' });
    }

    await paymentProviderModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Payment provider deleted successfully' });
  } catch (err) {
    next(err);
  }
};
