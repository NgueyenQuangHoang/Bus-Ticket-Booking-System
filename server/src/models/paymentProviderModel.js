import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM payment_providers ORDER BY provider_name ASC'
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM payment_providers WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO payment_providers (id, provider_name, provider_code, logo, is_active, config, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.provider_name, data.provider_code || null, data.logo || null,
      data.is_active !== undefined ? data.is_active : true,
      data.config ? JSON.stringify(data.config) : null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.provider_name !== undefined) { fields.push('provider_name = ?'); params.push(data.provider_name); }
  if (data.provider_code !== undefined) { fields.push('provider_code = ?'); params.push(data.provider_code); }
  if (data.logo !== undefined) { fields.push('logo = ?'); params.push(data.logo); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }
  if (data.config !== undefined) { fields.push('config = ?'); params.push(JSON.stringify(data.config)); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE payment_providers SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM payment_providers WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
