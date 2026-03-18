import pool from '../config/db.js';
import { generateUUID } from '../utils/helpers.js';

export async function findByScheduleId(scheduleId) {
  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_number, s.seat_label, s.price_extra,
       st.type_name AS seat_type_name
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     LEFT JOIN seat_types st ON s.seat_type_id = st.seat_type_id
     WHERE ss.schedule_id = ?
     ORDER BY s.seat_number ASC`,
    [scheduleId]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_number, s.seat_label, s.price_extra
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     WHERE ss.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  await pool.query(
    `INSERT INTO seat_schedules (id, schedule_id, seat_id, ticket_id, status, hold_expired_at, user_id, price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.schedule_id, data.seat_id, data.ticket_id || null,
      data.status || 'AVAILABLE', data.hold_expired_at || null,
      data.user_id || null, data.price || null
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.ticket_id !== undefined) { fields.push('ticket_id = ?'); params.push(data.ticket_id); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.user_id !== undefined) { fields.push('user_id = ?'); params.push(data.user_id); }
  if (data.hold_expired_at !== undefined) { fields.push('hold_expired_at = ?'); params.push(data.hold_expired_at); }
  if (data.price !== undefined) { fields.push('price = ?'); params.push(data.price); }

  if (fields.length === 0) return findById(id);

  params.push(id);

  await pool.query(`UPDATE seat_schedules SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function holdSeats(scheduleId, seatIds, userId) {
  if (!seatIds || seatIds.length === 0) return [];

  const holdExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes hold
  const holdExpiredAt = holdExpiry.toISOString().slice(0, 19).replace('T', ' ');

  const placeholders = seatIds.map(() => '?').join(', ');

  await pool.query(
    `UPDATE seat_schedules
     SET status = 'HOLD', user_id = ?, hold_expired_at = ?
     WHERE schedule_id = ? AND seat_id IN (${placeholders}) AND status = 'AVAILABLE'`,
    [userId, holdExpiredAt, scheduleId, ...seatIds]
  );

  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_number, s.seat_label, s.price_extra
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     WHERE ss.schedule_id = ? AND ss.seat_id IN (${placeholders})`,
    [scheduleId, ...seatIds]
  );
  return rows;
}

export async function releaseExpiredHolds() {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result] = await pool.query(
    `UPDATE seat_schedules
     SET status = 'AVAILABLE', user_id = NULL, hold_expired_at = NULL
     WHERE status = 'HOLD' AND hold_expired_at < ?`,
    [now]
  );
  return result.affectedRows;
}
