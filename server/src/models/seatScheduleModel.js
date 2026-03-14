import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findByScheduleId(scheduleId) {
  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_label, s.row_pos, s.col_pos, s.floor, s.price,
       st.type_name AS seat_type_name
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     LEFT JOIN seat_types st ON s.seat_type_id = st.seat_type_id
     WHERE ss.schedule_id = ?
     ORDER BY s.floor ASC, s.row_pos ASC, s.col_pos ASC`,
    [scheduleId]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_label, s.row_pos, s.col_pos, s.floor, s.price
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     WHERE ss.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO seat_schedules (id, schedule_id, seat_id, status, user_id, hold_expires_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.schedule_id, data.seat_id, data.status || 'available',
      data.user_id || null, data.hold_expires_at || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.user_id !== undefined) { fields.push('user_id = ?'); params.push(data.user_id); }
  if (data.hold_expires_at !== undefined) { fields.push('hold_expires_at = ?'); params.push(data.hold_expires_at); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE seat_schedules SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function holdSeats(scheduleId, seatIds, userId) {
  if (!seatIds || seatIds.length === 0) return [];

  const now = nowMySQL();
  const holdExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes hold
  const holdExpiresAt = holdExpiry.toISOString().slice(0, 19).replace('T', ' ');

  const placeholders = seatIds.map(() => '?').join(', ');

  await pool.query(
    `UPDATE seat_schedules
     SET status = 'hold', user_id = ?, hold_expires_at = ?, updated_at = ?
     WHERE schedule_id = ? AND seat_id IN (${placeholders}) AND status = 'available'`,
    [userId, holdExpiresAt, now, scheduleId, ...seatIds]
  );

  const [rows] = await pool.query(
    `SELECT ss.*, s.seat_label, s.row_pos, s.col_pos, s.floor, s.price
     FROM seat_schedules ss
     LEFT JOIN seats s ON ss.seat_id = s.id
     WHERE ss.schedule_id = ? AND ss.seat_id IN (${placeholders})`,
    [scheduleId, ...seatIds]
  );
  return rows;
}

export async function releaseExpiredHolds() {
  const now = nowMySQL();
  const [result] = await pool.query(
    `UPDATE seat_schedules
     SET status = 'available', user_id = NULL, hold_expires_at = NULL, updated_at = ?
     WHERE status = 'hold' AND hold_expires_at < ?`,
    [now, now]
  );
  return result.affectedRows;
}
