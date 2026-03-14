import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.city_id) {
    where.push('s.city_id = ?');
    params.push(filters.city_id);
  }

  if (filters.search) {
    where.push('s.station_name LIKE ?');
    params.push(`%${filters.search}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM stations s ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT s.*, c.city_name
     FROM stations s
     LEFT JOIN cities c ON s.city_id = c.id
     ${whereClause}
     ORDER BY s.station_name ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, c.city_name
     FROM stations s
     LEFT JOIN cities c ON s.city_id = c.id
     WHERE s.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO stations (id, station_name, address, city_id, latitude, longitude, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.station_name, data.address || null, data.city_id, data.latitude || null, data.longitude || null, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.station_name !== undefined) { fields.push('station_name = ?'); params.push(data.station_name); }
  if (data.address !== undefined) { fields.push('address = ?'); params.push(data.address); }
  if (data.city_id !== undefined) { fields.push('city_id = ?'); params.push(data.city_id); }
  if (data.latitude !== undefined) { fields.push('latitude = ?'); params.push(data.latitude); }
  if (data.longitude !== undefined) { fields.push('longitude = ?'); params.push(data.longitude); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE stations SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM stations WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
