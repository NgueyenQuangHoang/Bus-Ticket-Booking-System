import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.route_id) {
    where.push('sc.route_id = ?');
    params.push(filters.route_id);
  }

  if (filters.bus_id) {
    where.push('sc.bus_id = ?');
    params.push(filters.bus_id);
  }

  if (filters.status) {
    where.push('sc.status = ?');
    params.push(filters.status);
  }

  if (filters.date_from) {
    where.push('sc.departure_time >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    where.push('sc.departure_time <= ?');
    params.push(filters.date_to);
  }

  if (filters.departure_city_id) {
    where.push('dc.id = ?');
    params.push(filters.departure_city_id);
  }

  if (filters.arrival_city_id) {
    where.push('ac.id = ?');
    params.push(filters.arrival_city_id);
  }

  if (filters.bus_company_id) {
    where.push('b.bus_company_id = ?');
    params.push(filters.bus_company_id);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM schedules sc
     LEFT JOIN routes r ON sc.route_id = r.id
     LEFT JOIN buses b ON sc.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT sc.*,
       r.distance, r.duration,
       b.bus_name, b.license_plate, b.total_seats,
       bc.company_name, bc.logo AS company_logo, bc.id AS bus_company_id,
       ds.station_name AS departure_station_name, ds.address AS departure_address,
       dc.city_name AS departure_city_name, dc.id AS departure_city_id,
       ars.station_name AS arrival_station_name, ars.address AS arrival_address,
       ac.city_name AS arrival_city_name, ac.id AS arrival_city_id
     FROM schedules sc
     LEFT JOIN routes r ON sc.route_id = r.id
     LEFT JOIN buses b ON sc.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     ${whereClause}
     ORDER BY sc.departure_time ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT sc.*,
       r.distance, r.duration,
       b.bus_name, b.license_plate, b.total_seats,
       bc.company_name, bc.logo AS company_logo, bc.id AS bus_company_id,
       ds.station_name AS departure_station_name, ds.address AS departure_address,
       dc.city_name AS departure_city_name, dc.id AS departure_city_id,
       ars.station_name AS arrival_station_name, ars.address AS arrival_address,
       ac.city_name AS arrival_city_name, ac.id AS arrival_city_id
     FROM schedules sc
     LEFT JOIN routes r ON sc.route_id = r.id
     LEFT JOIN buses b ON sc.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     WHERE sc.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO schedules (id, route_id, bus_id, departure_time, arrival_time, price, available_seats, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.route_id, data.bus_id, data.departure_time, data.arrival_time || null,
      data.price || 0, data.available_seats || 0, data.status || 'active', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.route_id !== undefined) { fields.push('route_id = ?'); params.push(data.route_id); }
  if (data.bus_id !== undefined) { fields.push('bus_id = ?'); params.push(data.bus_id); }
  if (data.departure_time !== undefined) { fields.push('departure_time = ?'); params.push(data.departure_time); }
  if (data.arrival_time !== undefined) { fields.push('arrival_time = ?'); params.push(data.arrival_time); }
  if (data.price !== undefined) { fields.push('price = ?'); params.push(data.price); }
  if (data.available_seats !== undefined) { fields.push('available_seats = ?'); params.push(data.available_seats); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
