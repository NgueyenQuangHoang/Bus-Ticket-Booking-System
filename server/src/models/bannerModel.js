import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM banners ORDER BY position ASC, created_at DESC'
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO banners (id, image_url, position, target_type, target_id, start_date, end_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.image_url, data.position || 0,
      data.target_type || null, data.target_id || null,
      data.start_date || null, data.end_date || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.image_url !== undefined) { fields.push('image_url = ?'); params.push(data.image_url); }
  if (data.position !== undefined) { fields.push('position = ?'); params.push(data.position); }
  if (data.target_type !== undefined) { fields.push('target_type = ?'); params.push(data.target_type); }
  if (data.target_id !== undefined) { fields.push('target_id = ?'); params.push(data.target_id); }
  if (data.start_date !== undefined) { fields.push('start_date = ?'); params.push(data.start_date); }
  if (data.end_date !== undefined) { fields.push('end_date = ?'); params.push(data.end_date); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM banners WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
