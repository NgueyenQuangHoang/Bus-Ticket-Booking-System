import pool from '../config/db.js';
import { generateUUID } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('t.code LIKE ?');
    params.push(`%${filters.search}%`);
  }

  if (filters.status) {
    where.push('p.status = ?');
    params.push(filters.status);
  }

  if (filters.payment_method) {
    where.push('p.payment_method = ?');
    params.push(filters.payment_method);
  }

  if (filters.date_from) {
    where.push('p.transaction_date >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    where.push('p.transaction_date <= ?');
    params.push(filters.date_to);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const [countResult] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     ${whereClause}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT p.*, t.code AS ticket_code
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     ${whereClause}
     ORDER BY p.transaction_date DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, t.code AS ticket_code
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function findByTicketId(ticketId) {
  const [rows] = await pool.query(
    `SELECT p.*, t.code AS ticket_code, t.price AS ticket_price,
       pp.provider_name
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     LEFT JOIN payment_providers pp ON p.payment_provider_id = pp.id
     WHERE p.ticket_id = ?
     ORDER BY p.transaction_date DESC`,
    [ticketId]
  );
  return rows;
}

export async function create(data) {
  const id = generateUUID();
  await pool.query(
    `INSERT INTO payments (id, payment_provider_id, user_id, ticket_id, payment_method, amount, status, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.payment_provider_id || null, data.user_id || null,
      data.ticket_id, data.payment_method || 'CASH',
      data.amount || 0, data.status || 'PENDING',
      data.transaction_date || new Date().toISOString().slice(0, 19).replace('T', ' ')
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.payment_provider_id !== undefined) { fields.push('payment_provider_id = ?'); params.push(data.payment_provider_id); }
  if (data.user_id !== undefined) { fields.push('user_id = ?'); params.push(data.user_id); }
  if (data.ticket_id !== undefined) { fields.push('ticket_id = ?'); params.push(data.ticket_id); }
  if (data.payment_method !== undefined) { fields.push('payment_method = ?'); params.push(data.payment_method); }
  if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.transaction_date !== undefined) { fields.push('transaction_date = ?'); params.push(data.transaction_date); }

  if (fields.length === 0) return findById(id);

  params.push(id);

  await pool.query(`UPDATE payments SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}
