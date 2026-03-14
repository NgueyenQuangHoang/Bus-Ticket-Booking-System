import pool from '../config/db.js';
import * as seatScheduleModel from '../models/seatScheduleModel.js';
import * as ticketModel from '../models/ticketModel.js';
import * as passengerModel from '../models/passengerModel.js';
import * as paymentModel from '../models/paymentModel.js';
import * as scheduleModel from '../models/scheduleModel.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export const holdSeats = async (req, res, next) => {
  try {
    const { schedule_id, seat_ids } = req.body;

    if (!schedule_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'schedule_id and seat_ids are required' });
    }

    const userId = req.user.id;
    const result = await seatScheduleModel.holdSeats(schedule_id, seat_ids, userId);

    const heldSeats = result.filter(s => s.status === 'hold' && s.user_id === userId);
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
    const now = nowMySQL();
    const seatIds = seats.map(s => s.seat_id);

    await conn.beginTransaction();

    // 1. Verify seats are still HOLD for this user
    const placeholders = seatIds.map(() => '?').join(', ');
    const [holdCheck] = await conn.query(
      `SELECT * FROM seat_schedules
       WHERE schedule_id = ? AND seat_id IN (${placeholders}) AND status = 'hold' AND user_id = ?`,
      [schedule_id, ...seatIds, userId]
    );

    if (holdCheck.length !== seatIds.length) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ success: false, message: 'Some seats are no longer held by you' });
    }

    // 2. Create ticket
    const ticketId = generateUUID();
    const ticketCode = 'TK' + Date.now() + Math.floor(Math.random() * 1000);
    const totalAmount = seats.reduce((sum, s) => sum + (s.price || 0), 0);

    await conn.query(
      `INSERT INTO tickets (id, ticket_code, user_id, schedule_id, contact_name, contact_email, contact_phone, total_amount, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticketId, ticketCode, userId, schedule_id, passenger.full_name, passenger.email || null, passenger.phone, totalAmount, 'confirmed', now, now]
    );

    // 3. Create passenger for each seat
    for (const seat of seats) {
      const passengerId = generateUUID();
      // Get seat label
      const [seatRows] = await conn.query(
        'SELECT seat_label FROM seats WHERE id = ?',
        [seat.seat_id]
      );
      const seatLabel = seatRows.length > 0 ? seatRows[0].seat_label : null;

      await conn.query(
        `INSERT INTO passengers (id, ticket_id, passenger_name, passenger_phone, seat_id, seat_label, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [passengerId, ticketId, passenger.full_name, passenger.phone, seat.seat_id, seatLabel, now, now]
      );
    }

    // 4. Update seat_schedules to BOOKED
    await conn.query(
      `UPDATE seat_schedules SET status = 'booked', updated_at = ?
       WHERE schedule_id = ? AND seat_id IN (${placeholders})`,
      [now, schedule_id, ...seatIds]
    );

    // 5. Create payment record
    const paymentId = generateUUID();
    await conn.query(
      `INSERT INTO payments (id, ticket_id, provider_id, payment_method, transaction_id, amount, status, paid_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paymentId, ticketId, null, payment_method || 'cash', null, totalAmount, 'pending', null, now, now]
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
