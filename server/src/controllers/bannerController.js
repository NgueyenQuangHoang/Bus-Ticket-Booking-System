import * as bannerModel from '../models/bannerModel.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await bannerModel.findAll();

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const banner = await bannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.json({ success: true, data: banner, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const banner = await bannerModel.create(req.body);

    res.status(201).json({ success: true, data: banner, message: 'Banner created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await bannerModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const banner = await bannerModel.update(req.params.id, req.body);

    res.json({ success: true, data: banner, message: 'Banner updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const existing = await bannerModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await bannerModel.remove(req.params.id);

    res.json({ success: true, data: null, message: 'Banner deleted successfully' });
  } catch (err) {
    next(err);
  }
};
