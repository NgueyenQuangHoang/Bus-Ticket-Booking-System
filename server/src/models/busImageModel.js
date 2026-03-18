import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  let where = [];
  let params = [];

  if (filters.bus_id) {
    where.push('bus_id = ?');
    params.push(filters.bus_id);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM bus_images ${whereClause} ORDER BY created_at DESC`,
    params
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM bus_images WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_images (id, bus_id, image_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.bus_id, data.image_url, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.bus_id !== undefined) { fields.push('bus_id = ?'); params.push(data.bus_id); }
  if (data.image_url !== undefined) { fields.push('image_url = ?'); params.push(data.image_url); }

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
