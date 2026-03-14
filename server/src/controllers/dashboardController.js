import * as dashboardModel from '../models/dashboardModel.js';

export const getOverview = async (req, res, next) => {
  try {
    const [overview, revenueByDay, companyPerformance, paymentMethodStats, customerStats] = await Promise.all([
      dashboardModel.getOverview(),
      dashboardModel.getRevenueByDay(
        req.query.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        req.query.end_date || new Date().toISOString().slice(0, 10)
      ),
      dashboardModel.getCompanyPerformance(),
      dashboardModel.getPaymentMethodStats(),
      dashboardModel.getCustomerStats(),
    ]);

    res.json({
      success: true,
      data: {
        ...overview,
        revenueByDay,
        companyPerformance,
        paymentMethodStats,
        customerStats,
      },
      message: 'OK',
    });
  } catch (err) {
    next(err);
  }
};
