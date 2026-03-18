import pool from '../config/db.js';
import * as seatScheduleModel from '../models/seatScheduleModel.js';
import * as ticketModel from '../models/ticketModel.js';
import { generateUUID } from '../utils/helpers.js';

export const holdSeats = async (req, res, next) => {
  try {
    const { schedule_id, seat_ids } = req.body;

    if (!schedule_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'schedule_id and seat_ids are required' });
    }

    const userId = req.user.id;
    const result = await seatScheduleModel.holdSeats(schedule_id, seat_ids, userId);

    const heldSeats = result.filter(s => s.status === 'HOLD' && s.user_id === userId);
    if (heldSeats.length !== seat_ids.length) {
      return res.status(409).json({
        success: false,
        message: 'Some seats are no longer available',
        data: result,
      });
    }

    res.json({
      success: true,
      data: result,
      message: 'Seats held successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { schedule_id, seats, passenger, payment_method } = req.body;

    if (!schedule_id || !seats || !Array.isArray(seats) || seats.length === 0) {
      conn.release();
      return res.status(400).json({ success: false, message: 'schedule_id and seats are required' });
    }

    if (!passenger || !passenger.full_name || !passenger.phone) {
      conn.release();
      return res.status(400).json({ success: false, message: 'Passenger full_name and phone are required' });
    }

    const userId = req.user.id;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const seatIds = seats.map(s => s.seat_id);

    await conn.beginTransaction();

    // 1. Verify seats are still HOLD for this user
    const placeholders = seatIds.map(() => '?').join(', ');
    const [holdCheck] = await conn.query(
      `SELECT * FROM seat_schedules
       WHERE schedule_id = ? AND seat_id IN (${placeholders}) AND status = 'HOLD' AND user_id = ?`,
      [schedule_id, ...seatIds, userId]
    );

    if (holdCheck.length !== seatIds.length) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ success: false, message: 'Some seats are no longer held by you' });
    }

    // 2. Create ticket(s) — one ticket per seat
    const ticketCode = 'TK' + Date.now() + Math.floor(Math.random() * 1000);
    const totalPrice = seats.reduce((sum, s) => sum + (s.price || 0), 0);

    // Create a single ticket for the first seat, or one per seat
    const ticketId = generateUUID();
    await conn.query(
      `INSERT INTO tickets (id, schedule_id, seat_id, user_id, code, price, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticketId, schedule_id, seatIds[0] || null, userId, ticketCode, totalPrice, 'BOOKED', now, now]
    );

    // 3. Create passenger record
    const passengerId = generateUUID();
    await conn.query(
      `INSERT INTO passengers (id, ticket_id, full_name, phone, email, identity_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [passengerId, ticketId, passenger.full_name, passenger.phone, passenger.email || null, passenger.identity_number || null]
    );

    // 4. Update seat_schedules to BOOKED with ticket_id
    await conn.query(
      `UPDATE seat_schedules SET status = 'BOOKED', ticket_id = ?
       WHERE schedule_id = ? AND seat_id IN (${placeholders})`,
      [ticketId, schedule_id, ...seatIds]
    );

    // 5. Create payment record
    const paymentId = generateUUID();
    await conn.query(
      `INSERT INTO payments (id, payment_provider_id, user_id, ticket_id, payment_method, amount, status, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, null, userId, ticketId, payment_method || 'CASH', totalPrice, 'PENDING', now]
    );

    // 6. Update schedule available_seats
    await conn.query(
      `UPDATE schedules SET available_seats = available_seats - ?, updated_at = ? WHERE id = ?`,
      [seatIds.length, now, schedule_id]
    );

    await conn.commit();

    // Fetch the created ticket for response
    const ticket = await ticketModel.findById(ticketId);

    res.status(201).json({
      success: true,
      data: { ticket, ticket_code: ticketCode },
      message: 'Booking created successfully',
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};
