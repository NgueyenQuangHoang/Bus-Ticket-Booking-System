import pool from '../config/db.js';
import { generateUUID, nowMySQL } from '../utils/helpers.js';

export async function findAll(filters = {}) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];

  if (filters.search) {
    where.push('(p.transaction_id LIKE ? OR t.ticket_code LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
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
    where.push('p.created_at >= ?');
    params.push(filters.date_from);
  }

  if (filters.date_to) {
    where.push('p.created_at <= ?');
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
    `SELECT p.*, t.ticket_code, t.contact_name, t.contact_phone
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { data: rows, total: countResult[0].total };
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, t.ticket_code, t.contact_name, t.contact_phone
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function findByTicketId(ticketId) {
  const [rows] = await pool.query(
    `SELECT p.*, t.ticket_code, t.contact_name, t.contact_phone, t.total_amount AS ticket_amount,
       pp.provider_name
     FROM payments p
     LEFT JOIN tickets t ON p.ticket_id = t.id
     LEFT JOIN payment_providers pp ON p.provider_id = pp.id
     WHERE p.ticket_id = ?
     ORDER BY p.created_at DESC`,
    [ticketId]
  );
  return rows;
}

export async function create(data) {
  const id = generateUUID();
  const now = nowMySQL();
  await pool.query(
    `INSERT INTO payments (id, ticket_id, provider_id, payment_method, transaction_id, amount, status, paid_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.ticket_id, data.provider_id || null, data.payment_method,
      data.transaction_id || null, data.amount || 0,
      data.status || 'pending', data.paid_at || null, now, now
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const fields = [];
  const params = [];

  if (data.ticket_id !== undefined) { fields.push('ticket_id = ?'); params.push(data.ticket_id); }
  if (data.provider_id !== undefined) { fields.push('provider_id = ?'); params.push(data.provider_id); }
  if (data.payment_method !== undefined) { fields.push('payment_method = ?'); params.push(data.payment_method); }
  if (data.transaction_id !== undefined) { fields.push('transaction_id = ?'); params.push(data.transaction_id); }
  if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.paid_at !== undefined) { fields.push('paid_at = ?'); params.push(data.paid_at); }

  if (fields.length === 0) return findById(id);

  fields.push('updated_at = ?');
  params.push(nowMySQL());
  params.push(id);

  await pool.query(`UPDATE payments SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
}
