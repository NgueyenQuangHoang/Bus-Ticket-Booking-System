import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.bus_company_id) {
    where.push('bus_company_id = ?');
    params.push(filters.bus_company_id);
  }

  if (filters.is_template !== undefined) {
    where.push('is_template = ?');
    params.push(filters.is_template);
  }

  if (filters.search) {
    where.push('layout_name LIKE ?');
    params.push(`%${filters.search}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM bus_layouts ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT * FROM bus_layouts ${whereClause} ORDER BY layout_name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM bus_layouts WHERE layout_id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_layouts (layout_id, layout_name, bus_company_id, total_rows, total_columns, total_floors, is_template, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.layout_name, data.bus_company_id || null,
      data.total_rows || 0, data.total_columns || 0, data.total_floors || 1,
      data.is_template !== undefined ? data.is_template : false, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.layout_name !== undefined) { fields.push('layout_name = ?'); params.push(data.layout_name); }
  if (data.bus_company_id !== undefined) { fields.push('bus_company_id = ?'); params.push(data.bus_company_id); }
  if (data.total_rows !== undefined) { fields.push('total_rows = ?'); params.push(data.total_rows); }
  if (data.total_columns !== undefined) { fields.push('total_columns = ?'); params.push(data.total_columns); }
  if (data.total_floors !== undefined) { fields.push('total_floors = ?'); params.push(data.total_floors); }
  if (data.is_template !== undefined) { fields.push('is_template = ?'); params.push(data.is_template); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE bus_layouts SET ${fields.join(', ')} WHERE layout_id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM bus_layouts WHERE layout_id = ?', [id]);
  return result.affectedRows > 0;
}
