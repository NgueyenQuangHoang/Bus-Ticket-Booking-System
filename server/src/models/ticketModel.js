import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('(t.ticket_code LIKE ? OR t.contact_name LIKE ? OR t.contact_phone LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
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
       sc.departure_time, sc.arrival_time, sc.price AS schedule_price,
       b.bus_name, b.license_plate,
       bc.company_name, bc.logo AS company_logo,
       r.distance, r.duration,
       ds.station_name AS departure_station_name, ds.address AS departure_address,
       dc.city_name AS departure_city_name,
       ars.station_name AS arrival_station_name, ars.address AS arrival_address,
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
       sc.departure_time, sc.arrival_time, sc.price AS schedule_price,
       b.bus_name, b.license_plate,
       bc.company_name,
       ds.station_name AS departure_station_name,
       dc.city_name AS departure_city_name,
       ars.station_name AS arrival_station_name,
       ac.city_name AS arrival_city_name,
       p.passenger_name, p.passenger_phone, p.seat_label
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
     WHERE t.ticket_code = ? AND t.contact_phone = ?`,
    [code, phone]
  );
  return rows;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO tickets (id, ticket_code, user_id, schedule_id, contact_name, contact_email, contact_phone, total_amount, status, note, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.ticket_code, data.user_id || null, data.schedule_id,
      data.contact_name, data.contact_email || null, data.contact_phone,
      data.total_amount || 0, data.status || 'pending', data.note || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.ticket_code !== undefined) { fields.push('ticket_code = ?'); params.push(data.ticket_code); }
  if (data.user_id !== undefined) { fields.push('user_id = ?'); params.push(data.user_id); }
  if (data.schedule_id !== undefined) { fields.push('schedule_id = ?'); params.push(data.schedule_id); }
  if (data.contact_name !== undefined) { fields.push('contact_name = ?'); params.push(data.contact_name); }
  if (data.contact_email !== undefined) { fields.push('contact_email = ?'); params.push(data.contact_email); }
  if (data.contact_phone !== undefined) { fields.push('contact_phone = ?'); params.push(data.contact_phone); }
  if (data.total_amount !== undefined) { fields.push('total_amount = ?'); params.push(data.total_amount); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.note !== undefined) { fields.push('note = ?'); params.push(data.note); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}
