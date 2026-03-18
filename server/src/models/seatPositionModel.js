import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
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

  const [rows] = await pool.query(
    `SELECT sp.*, st.type_name AS seat_type_name
     FROM seat_positions sp
     LEFT JOIN seat_types st ON sp.seat_type_id = st.seat_type_id
     ${whereClause}
     ORDER BY sp.floor ASC, sp.row_index ASC, sp.column_index ASC`,
    params
  );

  return { data: rows, total: rows.length };
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
  const id = data.id || generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO seat_positions (id, layout_id, floor, row_index, column_index, seat_type_id, is_driver_seat, is_door, is_stair, is_aisle, label, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.layout_id, data.floor || 1,
      data.row_index, data.column_index, data.seat_type_id || null,
      data.is_driver_seat ? 1 : 0, data.is_door ? 1 : 0,
      data.is_stair ? 1 : 0, data.is_aisle ? 1 : 0,
      data.label || null, data.status || 'ACTIVE', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.layout_id !== undefined) { fields.push('layout_id = ?'); params.push(data.layout_id); }
  if (data.floor !== undefined) { fields.push('floor = ?'); params.push(data.floor); }
  if (data.row_index !== undefined) { fields.push('row_index = ?'); params.push(data.row_index); }
  if (data.column_index !== undefined) { fields.push('column_index = ?'); params.push(data.column_index); }
  if (data.seat_type_id !== undefined) { fields.push('seat_type_id = ?'); params.push(data.seat_type_id); }
  if (data.is_driver_seat !== undefined) { fields.push('is_driver_seat = ?'); params.push(data.is_driver_seat ? 1 : 0); }
  if (data.is_door !== undefined) { fields.push('is_door = ?'); params.push(data.is_door ? 1 : 0); }
  if (data.is_stair !== undefined) { fields.push('is_stair = ?'); params.push(data.is_stair ? 1 : 0); }
  if (data.is_aisle !== undefined) { fields.push('is_aisle = ?'); params.push(data.is_aisle ? 1 : 0); }
  if (data.label !== undefined) { fields.push('label = ?'); params.push(data.label); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

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
    pos.id || generateUUID(), pos.layout_id, pos.floor || 1,
    pos.row_index, pos.column_index, pos.seat_type_id || null,
    pos.is_driver_seat ? 1 : 0, pos.is_door ? 1 : 0,
    pos.is_stair ? 1 : 0, pos.is_aisle ? 1 : 0,
    pos.label || null, pos.status || 'ACTIVE', now, now
  ]);

  await pool.query(
    `INSERT INTO seat_positions (id, layout_id, floor, row_index, column_index, seat_type_id, is_driver_seat, is_door, is_stair, is_aisle, label, status, created_at, updated_at)
     VALUES ?`,
    [values]
  );

  const layoutId = positions[0].layout_id;
  const [rows] = await pool.query(
    'SELECT * FROM seat_positions WHERE layout_id = ? ORDER BY floor ASC, row_index ASC, column_index ASC',
    [layoutId]
  );
  return rows;
}
