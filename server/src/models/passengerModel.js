import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findByTicketId(ticketId) {
  const [rows] = await pool.query(
    'SELECT * FROM passengers WHERE ticket_id = ? ORDER BY created_at ASC',
    [ticketId]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM passengers WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO passengers (id, ticket_id, passenger_name, passenger_phone, seat_id, seat_label, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.ticket_id, data.passenger_name, data.passenger_phone || null,
      data.seat_id || null, data.seat_label || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.ticket_id !== undefined) { fields.push('ticket_id = ?'); params.push(data.ticket_id); }
  if (data.passenger_name !== undefined) { fields.push('passenger_name = ?'); params.push(data.passenger_name); }
  if (data.passenger_phone !== undefined) { fields.push('passenger_phone = ?'); params.push(data.passenger_phone); }
  if (data.seat_id !== undefined) { fields.push('seat_id = ?'); params.push(data.seat_id); }
  if (data.seat_label !== undefined) { fields.push('seat_label = ?'); params.push(data.seat_label); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE passengers SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM passengers WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
