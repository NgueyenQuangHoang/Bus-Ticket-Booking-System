import pool from '../config/db.js';

export async function getOverview() {
  const [revenueResult] = await pool.query(
    `SELECT COALESCE(SUM(price), 0) AS totalRevenue
     FROM tickets WHERE status IN ('BOOKED', 'COMPLETED')`
  );

  const [ticketResult] = await pool.query(
    `SELECT COUNT(*) AS totalTickets FROM tickets`
  );

  const [userResult] = await pool.query(
    `SELECT COUNT(*) AS totalUsers FROM users`
  );

  const [companyResult] = await pool.query(
    `SELECT COUNT(*) AS totalCompanies FROM bus_companies`
  );

  const [cancelledResult] = await pool.query(
    `SELECT COUNT(*) AS cancelledTickets FROM tickets WHERE status = 'CANCELLED'`
  );

  const totalTickets = ticketResult[0].totalTickets;
  const cancelledTickets = cancelledResult[0].cancelledTickets;
  const cancellationRate = totalTickets > 0 ? (cancelledTickets / totalTickets) * 100 : 0;

  return {
    totalRevenue: revenueResult[0].totalRevenue,
    totalTickets,
    totalUsers: userResult[0].totalUsers,
    totalCompanies: companyResult[0].totalCompanies,
    cancellationRate,
  };
}

export async function getRevenueByDay(startDate, endDate) {
  let where = "WHERE t.status IN ('BOOKED', 'COMPLETED')";
  const params = [];
  if (startDate && endDate) {
    where += ' AND t.created_at BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  const [rows] = await pool.query(
    `SELECT DATE(t.created_at) AS date, COALESCE(SUM(t.price), 0) AS revenue, COUNT(*) AS ticketsSold
     FROM tickets t
     ${where}
     GROUP BY DATE(t.created_at)
     ORDER BY DATE(t.created_at) ASC`,
    params
  );
  return rows;
}

export async function getCompanyPerformance() {
  const [rows] = await pool.query(
    `SELECT bc.id, bc.company_name, bc.image,
       COUNT(DISTINCT t.id) AS ticketsSold,
       COALESCE(SUM(t.price), 0) AS revenue,
       COALESCE(AVG(br.rating), 0) AS rating
     FROM bus_companies bc
     LEFT JOIN buses b ON b.bus_company_id = bc.id
     LEFT JOIN schedules sc ON sc.bus_id = b.id
     LEFT JOIN tickets t ON t.schedule_id = sc.id AND t.status IN ('BOOKED', 'COMPLETED')
     LEFT JOIN bus_reviews br ON br.bus_id = b.id
     GROUP BY bc.id, bc.company_name, bc.image
     ORDER BY revenue DESC`
  );
  return rows;
}

export async function getPaymentMethodStats() {
  const [rows] = await pool.query(
    `SELECT payment_method AS name, COUNT(*) AS value
     FROM payments
     WHERE status = 'COMPLETED'
     GROUP BY payment_method
     ORDER BY value DESC`
  );
  return rows;
}

export async function getCustomerStats() {
  // New customers (1 ticket) vs loyal (>1 ticket)
  const [stats] = await pool.query(
    `SELECT
       SUM(CASE WHEN ticket_count = 1 THEN 1 ELSE 0 END) AS newCustomers,
       SUM(CASE WHEN ticket_count > 1 THEN 1 ELSE 0 END) AS loyalCustomers
     FROM (
       SELECT user_id, COUNT(*) AS ticket_count
       FROM tickets
       WHERE user_id IS NOT NULL
       GROUP BY user_id
     ) AS user_tickets`
  );

  return {
    newCustomers: stats[0].newCustomers || 0,
    loyalCustomers: stats[0].loyalCustomers || 0,
  };
}
