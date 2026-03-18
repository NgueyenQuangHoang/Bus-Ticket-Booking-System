import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  let where = [];
  let params = [];

  if (filters.route_id) {
    where.push('route_id = ?');
    params.push(filters.route_id);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM cancellation_policies ${whereClause} ORDER BY cancellation_time_limit ASC`,
    params
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM cancellation_policies WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO cancellation_policies (id, route_id, cancellation_time_limit, refund_percentage, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id, data.route_id || null, data.cancellation_time_limit,
      data.refund_percentage, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.route_id !== undefined) { fields.push('route_id = ?'); params.push(data.route_id); }
  if (data.cancellation_time_limit !== undefined) { fields.push('cancellation_time_limit = ?'); params.push(data.cancellation_time_limit); }
  if (data.refund_percentage !== undefined) { fields.push('refund_percentage = ?'); params.push(data.refund_percentage); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE cancellation_policies SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM cancellation_policies WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
