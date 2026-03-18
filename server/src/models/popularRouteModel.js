import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll() {
  const [rows] = await pool.query(
    `SELECT pr.*,
       r.base_price, r.distance, r.duration,
       ds.station_name AS departure_station_name,
       dc.city_name AS departure_city_name, dc.image_city AS departure_city_image,
       ars.station_name AS arrival_station_name,
       ac.city_name AS arrival_city_name, ac.image_city AS arrival_city_image
     FROM popular_routes pr
     LEFT JOIN routes r ON pr.route_id = r.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     ORDER BY pr.priority ASC, pr.created_at DESC`
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT pr.*,
       r.base_price, r.distance, r.duration,
       ds.station_name AS departure_station_name,
       dc.city_name AS departure_city_name,
       ars.station_name AS arrival_station_name,
       ac.city_name AS arrival_city_name
     FROM popular_routes pr
     LEFT JOIN routes r ON pr.route_id = r.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     WHERE pr.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO popular_routes (id, route_id, image_url, priority, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.route_id, data.image_url || null, data.priority || 0, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.route_id !== undefined) { fields.push('route_id = ?'); params.push(data.route_id); }
  if (data.image_url !== undefined) { fields.push('image_url = ?'); params.push(data.image_url); }
  if (data.priority !== undefined) { fields.push('priority = ?'); params.push(data.priority); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE popular_routes SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM popular_routes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
