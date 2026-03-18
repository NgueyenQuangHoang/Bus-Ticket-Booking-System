import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

const SELECT_FIELDS = `layout_id AS id, layout_id, layout_name, total_rows, total_columns, floor_count, is_template, bus_company_id, created_at, updated_at`;

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
    params.push(filters.is_template === 'true' || filters.is_template === true || filters.is_template === '1' || filters.is_template === 1 ? 1 : 0);
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
    `SELECT ${SELECT_FIELDS} FROM bus_layouts ${whereClause} ORDER BY layout_name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS} FROM bus_layouts WHERE layout_id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO bus_layouts (layout_id, layout_name, total_rows, total_columns, floor_count, is_template, bus_company_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.layout_name,
      data.total_rows || 0, data.total_columns || 0, data.floor_count || 1,
      data.is_template !== undefined ? data.is_template : false,
      data.bus_company_id || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.layout_name !== undefined) { fields.push('layout_name = ?'); params.push(data.layout_name); }
  if (data.total_rows !== undefined) { fields.push('total_rows = ?'); params.push(data.total_rows); }
  if (data.total_columns !== undefined) { fields.push('total_columns = ?'); params.push(data.total_columns); }
  if (data.floor_count !== undefined) { fields.push('floor_count = ?'); params.push(data.floor_count); }
  if (data.is_template !== undefined) { fields.push('is_template = ?'); params.push(data.is_template); }
  if (data.bus_company_id !== undefined) { fields.push('bus_company_id = ?'); params.push(data.bus_company_id); }

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

export async function cloneForCompany(sourceLayoutId, newBusCompanyId, newName, isTemplate = 1) {
  const source = await findById(sourceLayoutId);
  if (!source) throw new Error(`Layout ${sourceLayoutId} not found`);

  const newId = generateUUID();
  const now = nowMySQL();
  const layoutName = newName ?? source.layout_name;

  await pool.query(
    `INSERT INTO bus_layouts (layout_id, layout_name, total_rows, total_columns, floor_count, is_template, bus_company_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [newId, layoutName, source.total_rows, source.total_columns, source.floor_count, isTemplate ? 1 : 0, newBusCompanyId, now, now]
  );

  const [srcPositions] = await pool.query(
    `SELECT * FROM seat_positions WHERE layout_id = ?`, [sourceLayoutId]
  );
  if (srcPositions.length > 0) {
    const values = srcPositions.map(p => [
      generateUUID(), newId, p.floor || 1,
      p.row_index, p.column_index, p.seat_type_id || null,
      p.is_driver_seat ? 1 : 0, p.is_door ? 1 : 0,
      p.is_stair ? 1 : 0, p.is_aisle ? 1 : 0,
      p.label || null, p.status || 'ACTIVE', now, now
    ]);
    await pool.query(
      `INSERT INTO seat_positions (id, layout_id, floor, row_index, column_index, seat_type_id, is_driver_seat, is_door, is_stair, is_aisle, label, status, created_at, updated_at)
       VALUES ?`,
      [values]
    );
  }

  return findById(newId);
}
