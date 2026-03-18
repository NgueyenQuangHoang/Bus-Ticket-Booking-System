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
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO payment_providers (id, provider_name, provider_type, api_endpoint, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.provider_name, data.provider_type || null, data.api_endpoint || null, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.provider_name !== undefined) { fields.push('provider_name = ?'); params.push(data.provider_name); }
  if (data.provider_type !== undefined) { fields.push('provider_type = ?'); params.push(data.provider_type); }
  if (data.api_endpoint !== undefined) { fields.push('api_endpoint = ?'); params.push(data.api_endpoint); }

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
