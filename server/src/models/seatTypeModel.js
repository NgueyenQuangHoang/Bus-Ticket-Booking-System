import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM seat_types ORDER BY type_name ASC'
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM seat_types WHERE seat_type_id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO seat_types (seat_type_id, type_name, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.type_name, data.description || null, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.type_name !== undefined) { fields.push('type_name = ?'); params.push(data.type_name); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE seat_types SET ${fields.join(', ')} WHERE seat_type_id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM seat_types WHERE seat_type_id = ?', [id]);
  return result.affectedRows > 0;
}
