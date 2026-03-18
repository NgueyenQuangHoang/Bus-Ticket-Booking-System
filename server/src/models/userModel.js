import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.status) {
    where.push('u.status = ?');
    params.push(filters.status);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.bus_company_id, u.status, u.created_at, u.updated_at,
            GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ',') AS role_names,
            GROUP_CONCAT(r.id ORDER BY r.role_name SEPARATOR ',') AS role_ids_list
     FROM users u
     LEFT JOIN user_role ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     ${whereClause}
     GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone, u.bus_company_id, u.status, u.created_at, u.updated_at
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, email, phone, bus_company_id, status, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, email, phone, password, bus_company_id, status, created_at, updated_at
     FROM users WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO users (id, first_name, last_name, email, phone, password, bus_company_id, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.first_name, data.last_name, data.email, data.phone || null, data.password, data.bus_company_id || null, data.status || 'ACTIVE', now, now]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.first_name !== undefined) { fields.push('first_name = ?'); params.push(data.first_name); }
  if (data.last_name !== undefined) { fields.push('last_name = ?'); params.push(data.last_name); }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
  if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }
  if (data.password !== undefined) { fields.push('password = ?'); params.push(data.password); }
  if (data.bus_company_id !== undefined) { fields.push('bus_company_id = ?'); params.push(data.bus_company_id); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function findUserRoles(userId) {
  const [rows] = await pool.query(
    `SELECT r.id, r.role_name
     FROM roles r
     INNER JOIN user_role ur ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows;
}

export async function updateUserRoles(userId, roleIds) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM user_role WHERE user_id = ?', [userId]);

    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await conn.query(
          'INSERT INTO user_role (id, user_id, role_id) VALUES (?, ?, ?)',
          [generateUUID(), userId, roleId]
        );
      }
    }

    await conn.commit();
    return findUserRoles(userId);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
