import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.departure_station_id) {
    where.push('r.departure_station_id = ?');
    params.push(filters.departure_station_id);
  }

  if (filters.arrival_station_id) {
    where.push('r.arrival_station_id = ?');
    params.push(filters.arrival_station_id);
  }

  if (filters.search) {
    where.push('(ds.station_name LIKE ? OR as2.station_name LIKE ? OR dc.city_name LIKE ? OR ac.city_name LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM routes r
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations as2 ON r.arrival_station_id = as2.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON as2.city_id = ac.id
     ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT r.*,
       ds.station_name AS departure_station_name, ds.location AS departure_location,
       dc.city_name AS departure_city_name, dc.id AS departure_city_id,
       as2.station_name AS arrival_station_name, as2.location AS arrival_location,
       ac.city_name AS arrival_city_name, ac.id AS arrival_city_id
     FROM routes r
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations as2 ON r.arrival_station_id = as2.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON as2.city_id = ac.id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT r.*,
       ds.station_name AS departure_station_name, ds.location AS departure_location,
       dc.city_name AS departure_city_name, dc.id AS departure_city_id,
       as2.station_name AS arrival_station_name, as2.location AS arrival_location,
       ac.city_name AS arrival_city_name, ac.id AS arrival_city_id
     FROM routes r
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations as2 ON r.arrival_station_id = as2.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON as2.city_id = ac.id
     WHERE r.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO routes (id, departure_station_id, arrival_station_id, base_price, duration, distance, description, image, total_bookings, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.departure_station_id, data.arrival_station_id,
      data.base_price || 0, data.duration || null, data.distance || null,
      data.description || null, data.image || null, data.total_bookings || 0, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.departure_station_id !== undefined) { fields.push('departure_station_id = ?'); params.push(data.departure_station_id); }
  if (data.arrival_station_id !== undefined) { fields.push('arrival_station_id = ?'); params.push(data.arrival_station_id); }
  if (data.base_price !== undefined) { fields.push('base_price = ?'); params.push(data.base_price); }
  if (data.duration !== undefined) { fields.push('duration = ?'); params.push(data.duration); }
  if (data.distance !== undefined) { fields.push('distance = ?'); params.push(data.distance); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
  if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image); }
  if (data.total_bookings !== undefined) { fields.push('total_bookings = ?'); params.push(data.total_bookings); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE routes SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM routes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
