import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('(company_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.status) {
    where.push('status = ?');
    params.push(filters.status);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM bus_companies ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT * FROM bus_companies ${whereClause} ORDER BY company_name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM bus_companies WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_companies (id, company_name, logo, description, phone, email, address, rating, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.company_name, data.logo || null, data.description || null,
      data.phone || null, data.email || null, data.address || null,
      data.rating || 0, data.status || 'active', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.company_name !== undefined) { fields.push('company_name = ?'); params.push(data.company_name); }
  if (data.logo !== undefined) { fields.push('logo = ?'); params.push(data.logo); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
  if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
  if (data.address !== undefined) { fields.push('address = ?'); params.push(data.address); }
  if (data.rating !== undefined) { fields.push('rating = ?'); params.push(data.rating); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE bus_companies SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM bus_companies WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
