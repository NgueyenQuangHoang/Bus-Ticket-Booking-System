import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('city_name LIKE ?');
    params.push(`%${filters.search}%`);
  }

  if (filters.region) {
    where.push('region = ?');
    params.push(filters.region);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM cities ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT * FROM cities ${whereClause} ORDER BY city_name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM cities WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO cities (id, city_name, region, image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.city_name, data.region || null, data.image || null, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.city_name !== undefined) { fields.push('city_name = ?'); params.push(data.city_name); }
  if (data.region !== undefined) { fields.push('region = ?'); params.push(data.region); }
  if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE cities SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM cities WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
