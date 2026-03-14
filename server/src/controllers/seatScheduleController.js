import * as seatScheduleModel from '../models/seatScheduleModel.js';

export const getByScheduleId = async (req, res, next) => {
  try {
    const data = await seatScheduleModel.findByScheduleId(req.params.scheduleId);

    res.json({ success: true, data, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const seatSchedule = await seatScheduleModel.findById(req.params.id);
    if (!seatSchedule) {
      return res.status(404).json({ success: false, message: 'Seat schedule not found' });
    }

    res.json({ success: true, data: seatSchedule, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const seatSchedule = await seatScheduleModel.create(req.body);

    res.status(201).json({ success: true, data: seatSchedule, message: 'Seat schedule created successfully' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const existing = await seatScheduleModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Seat schedule not found' });
    }

    const seatSchedule = await seatScheduleModel.update(req.params.id, req.body);

    res.json({ success: true, data: seatSchedule, message: 'Seat schedule updated successfully' });
  } catch (err) {
    next(err);
  }
};
