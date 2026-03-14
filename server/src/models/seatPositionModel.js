import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.layout_id) {
    where.push('sp.layout_id = ?');
    params.push(filters.layout_id);
  }

  if (filters.floor !== undefined) {
    where.push('sp.floor = ?');
    params.push(filters.floor);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total FROM seat_positions sp ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT sp.*, st.type_name AS seat_type_name
     FROM seat_positions sp
     LEFT JOIN seat_types st ON sp.seat_type_id = st.seat_type_id
     ${whereClause}
     ORDER BY sp.floor ASC, sp.row_pos ASC, sp.col_pos ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT sp.*, st.type_name AS seat_type_name
     FROM seat_positions sp
     LEFT JOIN seat_types st ON sp.seat_type_id = st.seat_type_id
     WHERE sp.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO seat_positions (id, layout_id, seat_label, seat_type_id, row_pos, col_pos, floor, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.layout_id, data.seat_label, data.seat_type_id || null,
      data.row_pos, data.col_pos, data.floor || 1,
      data.is_active !== undefined ? data.is_active : true, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.layout_id !== undefined) { fields.push('layout_id = ?'); params.push(data.layout_id); }
  if (data.seat_label !== undefined) { fields.push('seat_label = ?'); params.push(data.seat_label); }
  if (data.seat_type_id !== undefined) { fields.push('seat_type_id = ?'); params.push(data.seat_type_id); }
  if (data.row_pos !== undefined) { fields.push('row_pos = ?'); params.push(data.row_pos); }
  if (data.col_pos !== undefined) { fields.push('col_pos = ?'); params.push(data.col_pos); }
  if (data.floor !== undefined) { fields.push('floor = ?'); params.push(data.floor); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE seat_positions SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM seat_positions WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function bulkCreate(positions) {
  if (!positions || positions.length === 0) return [];

  const now = nowMySQL();
  const values = positions.map(pos => [
    generateUUID(), pos.layout_id, pos.seat_label, pos.seat_type_id || null,
    pos.row_pos, pos.col_pos, pos.floor || 1,
    pos.is_active !== undefined ? pos.is_active : true, now, now
  ]);

  await pool.query(
    `INSERT INTO seat_positions (id, layout_id, seat_label, seat_type_id, row_pos, col_pos, floor, is_active, created_at, updated_at)
     VALUES ?`,
    [values]
  );

  const layoutId = positions[0].layout_id;
  const [rows] = await pool.query(
    'SELECT * FROM seat_positions WHERE layout_id = ? ORDER BY floor ASC, row_pos ASC, col_pos ASC',
    [layoutId]
  );
  return rows;
}
