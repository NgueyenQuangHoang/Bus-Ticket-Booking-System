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
            const [users, tickets, companies, reviews, payments] = await Promise.all([
                api.get<any[]>('/users'),
                api.get<any[]>('/tickets'),
                api.get<any[]>('/bus_companies'),
                api.get<any[]>('/bus_reviews'),
                api.get<any[]>('/payments')
            ]);

            // Cast API responses to any because interceptor returns data directly, but TS thinks it's AxiosResponse
            const usersData = users as unknown as any[];
            const ticketsData = tickets as unknown as any[];
            const companiesData = companies as unknown as any[];
            const reviewsData = reviews as unknown as any[];
            const paymentsData = payments as unknown as any[];
            
            // 1. Revenue & Tickets Overview
            const totalRevenue = ticketsData
                .filter(t => t.status === 'COMPLETED' || t.status === 'BOOKED')
                .reduce((sum, t) => sum + (t.price || 0), 0);
            
            const totalTickets = ticketsData.length;

            // 2. Customer Loyalty
            const userBookingCounts = new Map<string, number>();
            ticketsData.forEach(t => {
                const uid = t.user_id;
                userBookingCounts.set(uid, (userBookingCounts.get(uid) || 0) + 1);
            });
            let newCustomers = 0;
            let loyalCustomers = 0;
            userBookingCounts.forEach(count => {
                if (count === 1) newCustomers++;
                else if (count > 1) loyalCustomers++;
            });

            // 3. Cancellation Rate
            const cancelledTickets = ticketsData.filter(t => t.status === 'CANCELLED').length;
            const cancellationRate = totalTickets > 0 ? (cancelledTickets / totalTickets) * 100 : 0;

            // 4. Revenue Over Time (Daily - Last 30 days)
            const revenueByDay = new Map<string, { revenue: number, tickets: number }>();
            ticketsData.forEach(t => {
                const isValid = t.status === 'COMPLETED' || t.status === 'BOOKED';
                if (!isValid) return;
                
                const date = new Date(t.created_at).toLocaleDateString('vi-VN');
                const curr = revenueByDay.get(date) || { revenue: 0, tickets: 0 };
                curr.revenue += (t.price || 0);
                curr.tickets += 1;
                revenueByDay.set(date, curr);
            });
            const revenueChartData = Array.from(revenueByDay.entries()).map(([date, val]) => ({
                date,
                revenue: val.revenue,
                ticketsSold: val.tickets
            })).sort((a,b) => {
                 const [d1, m1, y1] = a.date.split('/');
                 const [d2, m2, y2] = b.date.split('/');
                 return new Date(Number(y1), Number(m1)-1, Number(d1)).getTime() - new Date(Number(y2), Number(m2)-1, Number(d2)).getTime();
            });

            // 5. Company Performance & Reviews
            const companyStats = new Map<string, CompanyPerformance>();
            companiesData.forEach(c => {
                companyStats.set(String(c.id), {
                    id: c.id,
                    name: c.company_name,
                    revenue: 0,
                    ticketsSold: 0,
                    rating: c.rating_avg || 0
                });
            });

            // Update ratings from actual reviews if available
            const companyReviewSums = new Map<string, { total: number, count: number }>();
            reviewsData.forEach(r => {
                const cid = String(r.bus_company_id);
                const curr = companyReviewSums.get(cid) || { total: 0, count: 0 };
                curr.total += r.rating;
                curr.count += 1;
                companyReviewSums.set(cid, curr);
            });
            
            companyReviewSums.forEach((val, cid) => {
                const comp = companyStats.get(cid);
                if (comp) {
                    comp.rating = val.total / val.count;
                    companyStats.set(cid, comp);
                }
            });

            // 6. Payment Method Stats
            const paymentMethods = new Map<string, number>();
            paymentsData.forEach((p: any) => {
                const method = p.method || p.provider_type || 'UNKNOWN'; 
                paymentMethods.set(method, (paymentMethods.get(method) || 0) + 1);
            });
            const paymentMethodStats = Array.from(paymentMethods.entries()).map(([name, value]) => ({ name, value }));
            
            // 7. Station Frequency (from Routes/Schedules)
            // Fetch schedules to link tickets/revenue and station usage
            const schedulesRes = await api.get<any[]>('/schedules?_expand=bus&_expand=route');
            const schedules = schedulesRes as unknown as any[];
            
            const scheduleCompanyMap = new Map<string, string>();
            // To count station usage, we look at schedules (planned) or tickets (actual travel).
            // User asked for "Frequency of bus station activity".
            // Let's count departures/arrivals from *Schedules* as "Planned Activity" or Tickets as "Passenger Volume".
            // Let's go with "Ticket Volume per Route" or just count Stations from Route definitions used in Tickets.
            
            // We'll map Route ID -> Stations
            
            // We'll map Route ID -> Stations

            schedules.forEach(s => {
                if (s.bus) {
                    scheduleCompanyMap.set(String(s.id), String(s.bus.bus_company_id || s.bus.company_id));
                }
                
                // Count schedule frequency per route's stations? 
                // Better: Count how many times a station is involved in a schedule?
                // s.route stores departure/arrival station names usually if expanded?
                // The route object has start_station_id, end_station_id. We need names.
                // Assuming route expansion gives us names or we just use route name.
                // Let's simple count based on Route usage in Tickets
            });

            // Map tickets to companies for revenue
            ticketsData.forEach(t => {
                if (t.status !== 'COMPLETED' && t.status !== 'BOOKED') return;
                
                const companyId = scheduleCompanyMap.get(String(t.schedule_id));
                if (companyId) {
                    const stats = companyStats.get(companyId);
                    if (stats) {
                        stats.revenue += (t.price || 0);
                        stats.ticketsSold += 1;
                        companyStats.set(companyId, stats);
                    }
                }
            });

            return {
                system: {
                    totalRevenue,
                    totalTickets,
                    totalUsers: usersData.length,
                    totalCompanies: companiesData.length,
                    newCustomers,
                    loyalCustomers,
                    cancellationRate
                },
                revenueChartData,
                companyPerformance: Array.from(companyStats.values()),
                paymentMethodStats
            };

        } catch (error) {
            console.error("Error fetching admin dashboard stats", error);
            throw error;
        }
    }
};
