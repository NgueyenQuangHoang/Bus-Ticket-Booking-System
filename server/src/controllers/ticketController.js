import pool from '../config/db.js';
import * as ticketModel from '../models/ticketModel.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || undefined,
      status: req.query.status || undefined,
      user_id: req.query.user_id || undefined,
      schedule_id: req.query.schedule_id || undefined,
    };

    const result = await ticketModel.findAll(filters);

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
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: ticket, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketModel.findByUserId(req.user.id);

    res.json({ success: true, data: tickets, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const findTicket = async (req, res, next) => {
  try {
    const { code, phone } = req.query;

    if (!code || !phone) {
      return res.status(400).json({ success: false, message: 'code and phone are required' });
    }

    const tickets = await ticketModel.findByCodeAndPhone(code, phone);

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, data: tickets, message: 'OK' });
  } catch (err) {
    next(err);
  }
};

export const cancelTicket = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const ticketId = req.params.id;
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      conn.release();
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.status === 'CANCELLED') {
      conn.release();
      return res.status(400).json({ success: false, message: 'Ticket is already cancelled' });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await conn.beginTransaction();

    // 1. Update ticket status to CANCELLED
    await conn.query(
      'UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?',
      ['CANCELLED', now, ticketId]
    );

    // 2. Find seat_schedules linked to this ticket
    const [seatSchedules] = await conn.query(
      'SELECT seat_id FROM seat_schedules WHERE ticket_id = ?',
      [ticketId]
    );
    const seatIds = seatSchedules.map(ss => ss.seat_id).filter(Boolean);

    // 3. Release seat_schedules back to AVAILABLE
    if (seatIds.length > 0) {
      const placeholders = seatIds.map(() => '?').join(', ');
      await conn.query(
        `UPDATE seat_schedules SET status = 'AVAILABLE', user_id = NULL, hold_expired_at = NULL, ticket_id = NULL
         WHERE schedule_id = ? AND seat_id IN (${placeholders})`,
        [ticket.schedule_id, ...seatIds]
      );

      // 4. Update schedule available_seats
      await conn.query(
        'UPDATE schedules SET available_seats = available_seats + ?, updated_at = ? WHERE id = ?',
        [seatIds.length, now, ticket.schedule_id]
      );
    }

    await conn.commit();

    const updatedTicket = await ticketModel.findById(ticketId);

    res.json({ success: true, data: updatedTicket, message: 'Ticket cancelled successfully' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};
