import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('(company_name LIKE ? OR contact_email LIKE ? OR contact_phone LIKE ?)');
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
    `INSERT INTO bus_companies (id, company_name, image, license_number, contact_phone, contact_email, address, description, rating_avg, rating_count, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.company_name, data.image || null, data.license_number || null,
      data.contact_phone || null, data.contact_email || null, data.address || null,
      data.description || null, data.rating_avg || 0, data.rating_count || 0,
      data.status || 'ACTIVE', now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.company_name !== undefined) { fields.push('company_name = ?'); params.push(data.company_name); }
  if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image); }
  if (data.license_number !== undefined) { fields.push('license_number = ?'); params.push(data.license_number); }
  if (data.contact_phone !== undefined) { fields.push('contact_phone = ?'); params.push(data.contact_phone); }
  if (data.contact_email !== undefined) { fields.push('contact_email = ?'); params.push(data.contact_email); }
  if (data.address !== undefined) { fields.push('address = ?'); params.push(data.address); }
  if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
  if (data.rating_avg !== undefined) { fields.push('rating_avg = ?'); params.push(data.rating_avg); }
  if (data.rating_count !== undefined) { fields.push('rating_count = ?'); params.push(data.rating_count); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE bus_companies SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get all buses for this company
    const [buses] = await conn.query('SELECT id FROM buses WHERE bus_company_id = ?', [id]);
    const busIds = buses.map(b => b.id);

    if (busIds.length > 0) {
      const placeholders = busIds.map(() => '?').join(',');

      // Get all schedules for these buses
      const [schedules] = await conn.query(
        `SELECT id FROM schedules WHERE bus_id IN (${placeholders})`, busIds
      );
      const scheduleIds = schedules.map(s => s.id);

      if (scheduleIds.length > 0) {
        const sPlaceholders = scheduleIds.map(() => '?').join(',');

        // Get ticket IDs for these schedules
        const [tickets] = await conn.query(
          `SELECT id FROM tickets WHERE schedule_id IN (${sPlaceholders})`, scheduleIds
        );
        const ticketIds = tickets.map(t => t.id);

        if (ticketIds.length > 0) {
          const tPlaceholders = ticketIds.map(() => '?').join(',');
          // Nullify payment references to these tickets
          await conn.query(
            `UPDATE payments SET ticket_id = NULL WHERE ticket_id IN (${tPlaceholders})`, ticketIds
          );
        }

        // Delete seat_schedules (RESTRICT on schedule_id)
        await conn.query(
          `DELETE FROM seat_schedules WHERE schedule_id IN (${sPlaceholders})`, scheduleIds
        );

        // Delete tickets (passengers cascade via FK)
        await conn.query(
          `DELETE FROM tickets WHERE schedule_id IN (${sPlaceholders})`, scheduleIds
        );

        // Delete schedules
        await conn.query(
          `DELETE FROM schedules WHERE id IN (${sPlaceholders})`, scheduleIds
        );
      }
    }

    // Delete bus company — buses cascade (bus_images, seats, bus_reviews all have ON DELETE CASCADE)
    const [result] = await conn.query('DELETE FROM bus_companies WHERE id = ?', [id]);

    await conn.commit();
    return result.affectedRows > 0;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
