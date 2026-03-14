import pool from '../config/db.js';

export async function getOverview() {
  const [revenueResult] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS totalRevenue
     FROM payments WHERE status = 'completed'`
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

  const [busResult] = await pool.query(
    `SELECT COUNT(*) AS totalBuses FROM buses`
  );

  const [scheduleResult] = await pool.query(
    `SELECT COUNT(*) AS totalSchedules FROM schedules WHERE status = 'active'`
  );

  const [pendingTickets] = await pool.query(
    `SELECT COUNT(*) AS pendingTickets FROM tickets WHERE status = 'pending'`
  );

  const [todayRevenue] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS todayRevenue
     FROM payments
     WHERE status = 'completed' AND DATE(paid_at) = CURDATE()`
  );

  return {
    totalRevenue: revenueResult[0].totalRevenue,
    totalTickets: ticketResult[0].totalTickets,
    totalUsers: userResult[0].totalUsers,
    totalCompanies: companyResult[0].totalCompanies,
    totalBuses: busResult[0].totalBuses,
    totalSchedules: scheduleResult[0].totalSchedules,
    pendingTickets: pendingTickets[0].pendingTickets,
    todayRevenue: todayRevenue[0].todayRevenue,
  };
}

export async function getRevenueByDay(startDate, endDate) {
  const [rows] = await pool.query(
    `SELECT DATE(paid_at) AS date, COALESCE(SUM(amount), 0) AS revenue, COUNT(*) AS count
     FROM payments
     WHERE status = 'completed' AND paid_at BETWEEN ? AND ?
     GROUP BY DATE(paid_at)
     ORDER BY DATE(paid_at) ASC`,
    [startDate, endDate]
  );
  return rows;
}

export async function getCompanyPerformance() {
  const [rows] = await pool.query(
    `SELECT bc.id, bc.company_name, bc.logo,
       COUNT(DISTINCT b.id) AS totalBuses,
       COUNT(DISTINCT sc.id) AS totalSchedules,
       COUNT(DISTINCT t.id) AS totalTickets,
       COALESCE(SUM(p.amount), 0) AS totalRevenue,
       COALESCE(AVG(br.rating), 0) AS avgRating
     FROM bus_companies bc
     LEFT JOIN buses b ON b.bus_company_id = bc.id
     LEFT JOIN schedules sc ON sc.bus_id = b.id
     LEFT JOIN tickets t ON t.schedule_id = sc.id
     LEFT JOIN payments p ON p.ticket_id = t.id AND p.status = 'completed'
     LEFT JOIN bus_reviews br ON br.bus_id = b.id
     GROUP BY bc.id, bc.company_name, bc.logo
     ORDER BY totalRevenue DESC`
  );
  return rows;
}

export async function getPaymentMethodStats() {
  const [rows] = await pool.query(
    `SELECT payment_method, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS totalAmount
     FROM payments
     WHERE status = 'completed'
     GROUP BY payment_method
     ORDER BY totalAmount DESC`
  );
  return rows;
}

export async function getCustomerStats() {
  const [newUsersToday] = await pool.query(
    `SELECT COUNT(*) AS count FROM users WHERE DATE(created_at) = CURDATE()`
  );

  const [newUsersThisMonth] = await pool.query(
    `SELECT COUNT(*) AS count FROM users
     WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())`
  );

  const [topCustomers] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.avatar,
       COUNT(t.id) AS totalTickets,
       COALESCE(SUM(p.amount), 0) AS totalSpent
     FROM users u
     INNER JOIN tickets t ON t.user_id = u.id
     LEFT JOIN payments p ON p.ticket_id = t.id AND p.status = 'completed'
     GROUP BY u.id, u.full_name, u.email, u.avatar
     ORDER BY totalSpent DESC
     LIMIT 10`
  );

  return {
    newUsersToday: newUsersToday[0].count,
    newUsersThisMonth: newUsersThisMonth[0].count,
    topCustomers,
  };
}
