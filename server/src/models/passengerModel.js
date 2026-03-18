import pool from '../config/db.js';
import { generateUUID } from '../utils/helpers.js';

export async function findByTicketId(ticketId) {
  const [rows] = await pool.query(
    'SELECT * FROM passengers WHERE ticket_id = ?',
    [ticketId]
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM passengers WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const id = generateUUID();
  await pool.query(
    `INSERT INTO passengers (id, ticket_id, full_name, phone, email, identity_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id, data.ticket_id, data.full_name, data.phone,
      data.email || null, data.identity_number || null
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.ticket_id !== undefined) { fields.push('ticket_id = ?'); params.push(data.ticket_id); }
  if (data.full_name !== undefined) { fields.push('full_name = ?'); params.push(data.full_name); }
  if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
  if (data.identity_number !== undefined) { fields.push('identity_number = ?'); params.push(data.identity_number); }

  if (fields.length === 0) return findById(id);

  params.push(id);

  await pool.query(`UPDATE passengers SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query('DELETE FROM passengers WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
