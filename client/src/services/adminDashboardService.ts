import api from '../api/api';
// Service for Admin Dashboard Statistics

export interface RevenueStat {
    date: string;
    revenue: number;
    ticketsSold: number;
}

export interface CompanyPerformance {
    id: string;
    name: string;
    revenue: number;
    ticketsSold: number;
    rating: number;
}

export interface SystemStats {
    totalRevenue: number;
    totalTickets: number;
    totalUsers: number;
    totalCompanies: number;
    newCustomers: number; // Users with 1 booking
    loyalCustomers: number; // Users with > 1 booking
    cancellationRate: number;
}

export const adminDashboardService = {
    getOverviewStats: async () => {
        try {
            // Backend returns pre-calculated stats from GET /dashboard/overview
            const response: any = await api.get('/dashboard/overview');

            // Map backend response to match the existing frontend interface format
            const customerStats = response.customerStats ?? {};
        return {
                system: {
                    totalRevenue: Number(response.totalRevenue ?? 0),
                    totalTickets: Number(response.totalTickets ?? 0),
                    totalUsers: Number(response.totalUsers ?? 0),
                    totalCompanies: Number(response.totalCompanies ?? 0),
                    newCustomers: Number(customerStats.newCustomers ?? response.newCustomers ?? 0),
                    loyalCustomers: Number(customerStats.loyalCustomers ?? response.loyalCustomers ?? 0),
                    cancellationRate: Number(response.cancellationRate ?? 0),
                },
                revenueChartData: (response.revenueByDay ?? response.revenueChartData ?? []).map((r: any) => ({
                    date: r.date,
                    revenue: Number(r.revenue ?? 0),
                    ticketsSold: Number(r.ticketsSold ?? 0),
                })),
                companyPerformance: (response.companyPerformance ?? []).map((c: any) => ({
                    id: c.id,
                    name: c.name ?? c.company_name ?? '',
                    revenue: Number(c.revenue ?? 0),
                    ticketsSold: Number(c.ticketsSold ?? 0),
                    rating: Number(c.rating ?? 0),
                })),
                paymentMethodStats: (response.paymentMethodStats ?? []).map((p: any) => ({
                    name: p.name,
                    value: Number(p.value ?? 0),
                })),
            };

        } catch (error) {
            console.error("Error fetching admin dashboard stats", error);
            throw error;
        }
    }
};
