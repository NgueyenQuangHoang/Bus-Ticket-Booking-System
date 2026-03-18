import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.bus_id) {
    where.push('s.bus_id = ?');
    params.push(filters.bus_id);
  }

  if (filters.status) {
    where.push('s.status = ?');
    params.push(filters.status);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM seats s ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT s.*, st.type_name AS seat_type_name
     FROM seats s
     LEFT JOIN seat_types st ON s.seat_type_id = st.seat_type_id
     ${whereClause}
     ORDER BY s.seat_number ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, st.type_name AS seat_type_name
     FROM seats s
     LEFT JOIN seat_types st ON s.seat_type_id = st.seat_type_id
     WHERE s.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO seats (id, bus_id, seat_number, seat_label, seat_type_id, price_extra, is_available_for_booking, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.bus_id, data.seat_number || null, data.seat_label || null,
      data.seat_type_id || null, data.price_extra || 0,
      data.is_available_for_booking !== undefined ? data.is_available_for_booking : true,
      data.status || 'AVAILABLE', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.bus_id !== undefined) { fields.push('bus_id = ?'); params.push(data.bus_id); }
  if (data.seat_number !== undefined) { fields.push('seat_number = ?'); params.push(data.seat_number); }
  if (data.seat_label !== undefined) { fields.push('seat_label = ?'); params.push(data.seat_label); }
  if (data.seat_type_id !== undefined) { fields.push('seat_type_id = ?'); params.push(data.seat_type_id); }
  if (data.price_extra !== undefined) { fields.push('price_extra = ?'); params.push(data.price_extra); }
  if (data.is_available_for_booking !== undefined) { fields.push('is_available_for_booking = ?'); params.push(data.is_available_for_booking); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE seats SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM seats WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
