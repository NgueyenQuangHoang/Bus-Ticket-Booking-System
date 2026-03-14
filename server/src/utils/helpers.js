import crypto from 'crypto';

export function generateUUID() {
  return crypto.randomUUID();
}

export function formatDateMySQL(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function nowMySQL() {
  return formatDateMySQL(new Date());
}
