import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC'
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO banners (id, title, image_url, link_url, sort_order, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.title || null, data.image_url, data.link_url || null,
      data.sort_order || 0, data.is_active !== undefined ? data.is_active : true, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.image_url !== undefined) { fields.push('image_url = ?'); params.push(data.image_url); }
  if (data.link_url !== undefined) { fields.push('link_url = ?'); params.push(data.link_url); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); params.push(data.sort_order); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

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
