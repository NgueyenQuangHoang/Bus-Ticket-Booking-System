import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.bus_company_id) {
    where.push('b.bus_company_id = ?');
    params.push(filters.bus_company_id);
  }

  if (filters.vehicle_type_id) {
    where.push('b.vehicle_type_id = ?');
    params.push(filters.vehicle_type_id);
  }

  if (filters.search) {
    where.push('(b.name LIKE ? OR b.license_plate LIKE ? OR bc.company_name LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM buses b
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT b.*,
       bc.company_name,
       vt.type_name AS vehicle_type_name,
       bl.layout_name
     FROM buses b
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN vehicle_types vt ON b.vehicle_type_id = vt.vehicle_type_id
     LEFT JOIN bus_layouts bl ON b.layout_id = bl.layout_id
     ${whereClause}
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT b.*,
       bc.company_name,
       vt.type_name AS vehicle_type_name,
       bl.layout_name
     FROM buses b
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     LEFT JOIN vehicle_types vt ON b.vehicle_type_id = vt.vehicle_type_id
     LEFT JOIN bus_layouts bl ON b.layout_id = bl.layout_id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO buses (id, bus_company_id, name, descriptions, license_plate, capacity, vehicle_type_id, layout_id, thumbnail_image, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.bus_company_id, data.name, data.descriptions || null,
      data.license_plate || null, data.capacity || 0,
      data.vehicle_type_id || null, data.layout_id || null,
      data.thumbnail_image || null, data.status || 'ACTIVE', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
  if (data.descriptions !== undefined) { fields.push('descriptions = ?'); params.push(data.descriptions); }
  if (data.license_plate !== undefined) { fields.push('license_plate = ?'); params.push(data.license_plate); }
  if (data.bus_company_id !== undefined) { fields.push('bus_company_id = ?'); params.push(data.bus_company_id); }
  if (data.vehicle_type_id !== undefined) { fields.push('vehicle_type_id = ?'); params.push(data.vehicle_type_id); }
  if (data.layout_id !== undefined) { fields.push('layout_id = ?'); params.push(data.layout_id); }
  if (data.capacity !== undefined) { fields.push('capacity = ?'); params.push(data.capacity); }
  if (data.thumbnail_image !== undefined) { fields.push('thumbnail_image = ?'); params.push(data.thumbnail_image); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE buses SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM buses WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
