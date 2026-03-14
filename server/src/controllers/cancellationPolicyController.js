import * as cancellationPolicyModel from '../models/cancellationPolicyModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      route_id: req.query.route_id || undefined,
    };

    const data = await cancellationPolicyModel.findAll(filters);

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const policy = await cancellationPolicyModel.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Cancellation policy not found' });
    }

    res.json({ success: true, data: policy, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const policy = await cancellationPolicyModel.create(req.body);

    res.status(201).json({ success: true, data: policy, message: 'Cancellation policy created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await cancellationPolicyModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Cancellation policy not found' });
    }

    const policy = await cancellationPolicyModel.update(req.params.id, req.body);

    res.json({ success: true, data: policy, message: 'Cancellation policy updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await cancellationPolicyModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Cancellation policy not found' });
    }

    await cancellationPolicyModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Cancellation policy deleted successfully' });
  } catch (err) {
    next(err);
  }
};
