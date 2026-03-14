import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.bus_id) {
    where.push('br.bus_id = ?');
    params.push(filters.bus_id);
  }

  if (filters.bus_company_id) {
    where.push('b.bus_company_id = ?');
    params.push(filters.bus_company_id);
  }

  if (filters.user_id) {
    where.push('br.user_id = ?');
    params.push(filters.user_id);
  }

  if (filters.rating) {
    where.push('br.rating = ?');
    params.push(filters.rating);
  }

  if (filters.search) {
    where.push('(br.comment LIKE ? OR u.full_name LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM bus_reviews br
     LEFT JOIN users u ON br.user_id = u.id
     LEFT JOIN buses b ON br.bus_id = b.id
     ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT br.*, u.full_name AS user_name, u.avatar AS user_avatar,
       b.bus_name, bc.company_name
     FROM bus_reviews br
     LEFT JOIN users u ON br.user_id = u.id
     LEFT JOIN buses b ON br.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     ${whereClause}
     ORDER BY br.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT br.*, u.full_name AS user_name, u.avatar AS user_avatar,
       b.bus_name, bc.company_name
     FROM bus_reviews br
     LEFT JOIN users u ON br.user_id = u.id
     LEFT JOIN buses b ON br.bus_id = b.id
     LEFT JOIN bus_companies bc ON b.bus_company_id = bc.id
     WHERE br.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_reviews (id, bus_id, user_id, rating, comment, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.bus_id, data.user_id, data.rating, data.comment || null, now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.rating !== undefined) { fields.push('rating = ?'); params.push(data.rating); }
  if (data.comment !== undefined) { fields.push('comment = ?'); params.push(data.comment); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE bus_reviews SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM bus_reviews WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
