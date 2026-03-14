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
            return {
                system: {
                    totalRevenue: response.totalRevenue ?? response.system?.totalRevenue ?? 0,
                    totalTickets: response.totalTickets ?? response.system?.totalTickets ?? 0,
                    totalUsers: response.totalUsers ?? response.system?.totalUsers ?? 0,
                    totalCompanies: response.totalCompanies ?? response.system?.totalCompanies ?? 0,
                    newCustomers: response.newCustomers ?? response.system?.newCustomers ?? 0,
                    loyalCustomers: response.loyalCustomers ?? response.system?.loyalCustomers ?? 0,
                    cancellationRate: response.cancellationRate ?? response.system?.cancellationRate ?? 0
                },
                revenueChartData: response.revenueChartData ?? [],
                companyPerformance: response.companyPerformance ?? [],
                paymentMethodStats: response.paymentMethodStats ?? []
            };

        } catch (error) {
            console.error("Error fetching admin dashboard stats", error);
            throw error;
        }
    }
};
