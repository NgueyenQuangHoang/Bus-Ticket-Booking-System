import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.bus_id) {
    where.push('bus_id = ?');
    params.push(filters.bus_id);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM bus_images ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT * FROM bus_images ${whereClause} ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM bus_images WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_images (id, bus_id, image_url, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.bus_id, data.image_url, data.sort_order || 0, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.bus_id !== undefined) { fields.push('bus_id = ?'); params.push(data.bus_id); }
  if (data.image_url !== undefined) { fields.push('image_url = ?'); params.push(data.image_url); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); params.push(data.sort_order); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE bus_images SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM bus_images WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
