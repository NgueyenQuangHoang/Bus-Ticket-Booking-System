import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('t.code LIKE ?');
    params.push(`%${filters.search}%`);
  }

  if (filters.status) {
    where.push('t.status = ?');
    params.push(filters.status);
  }

  if (filters.user_id) {
    where.push('t.user_id = ?');
    params.push(filters.user_id);
  }

  if (filters.schedule_id) {
    where.push('t.schedule_id = ?');
    params.push(filters.schedule_id);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM tickets t ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT t.*
     FROM tickets t
     ${whereClause}
     ORDER BY t.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function findByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT t.*,
       sc.departure_time, sc.arrival_time,
       b.name AS bus_name, b.license_plate,
       bc.company_name, bc.image AS company_image,
       r.distance, r.duration, r.base_price,
       ds.station_name AS departure_station_name, ds.location AS departure_location,
       dc.city_name AS departure_city_name,
       ars.station_name AS arrival_station_name, ars.location AS arrival_location,
       ac.city_name AS arrival_city_name
     FROM tickets t
     LEFT JOIN schedules sc ON t.schedule_id = sc.id
     LEFT JOIN buses b ON sc.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN routes r ON sc.route_id = r.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     WHERE t.user_id = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function findByCodeAndPhone(code, phone) {
  const [rows] = await pool.query(
    `SELECT t.*,
       sc.departure_time, sc.arrival_time,
       b.name AS bus_name, b.license_plate,
       bc.company_name,
       ds.station_name AS departure_station_name,
       dc.city_name AS departure_city_name,
       ars.station_name AS arrival_station_name,
       ac.city_name AS arrival_city_name,
       p.full_name AS passenger_name, p.phone AS passenger_phone
     FROM tickets t
     LEFT JOIN schedules sc ON t.schedule_id = sc.id
     LEFT JOIN buses b ON sc.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN routes r ON sc.route_id = r.id
     LEFT JOIN stations ds ON r.departure_station_id = ds.id
     LEFT JOIN stations ars ON r.arrival_station_id = ars.id
     LEFT JOIN cities dc ON ds.city_id = dc.id
     LEFT JOIN cities ac ON ars.city_id = ac.id
     LEFT JOIN passengers p ON p.ticket_id = t.id
     WHERE t.code = ? AND p.phone = ?`,
    [code, phone]
  );
  return rows;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO tickets (id, schedule_id, seat_id, user_id, code, price, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.schedule_id, data.seat_id || null, data.user_id || null,
      data.code, data.price || 0, data.status || 'PENDING', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.schedule_id !== undefined) { fields.push('schedule_id = ?'); params.push(data.schedule_id); }
  if (data.seat_id !== undefined) { fields.push('seat_id = ?'); params.push(data.seat_id); }
  if (data.user_id !== undefined) { fields.push('user_id = ?'); params.push(data.user_id); }
  if (data.code !== undefined) { fields.push('code = ?'); params.push(data.code); }
  if (data.price !== undefined) { fields.push('price = ?'); params.push(data.price); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}
