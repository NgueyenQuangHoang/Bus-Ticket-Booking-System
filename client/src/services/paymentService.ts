import api from '../api/api';

interface Ticket {
    id: string;
    code: string;
    user_id: string;
    // Add other properties if needed based on usage
}

export interface Payment {
    id: string;
    ticket_id: string;
    amount: number;
    method: 'QR_PAYMENT' | 'E_WALLET' | 'BANK_TRANSFER' | string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
    transaction_date: string;
    ticket?: Ticket;
}

interface PaymentListResponse {
    data: Payment[];
    total: number;
}


export interface PaymentDetail {
    userInfo: {
        name: string;
        email: string;
        phone: string;
        passenger: string;
    };
    ticketInfo: {
        code: string;
        route: string;
        time: string;
        seat: string;
        status: string;
    };
}

export const paymentService = {
    getAllPayments: async (page: number, limit: number, search: string, filter: string): Promise<PaymentListResponse> => {
        try {
            // Build query string for FILTERING only (fetching all matching to handle pagination + total count manually)
            let url = '/payments?_sort=transaction_date&_order=desc&_expand=ticket';

            if (search) {
                // Determine if search is close to an ID or Code
                url += `&q=${search}`;
            }

            if (filter && filter !== 'ALL') {
                url += `&status=${filter}`;
            }

            // Fetch ALL matching records
            // We fetch tickets separately to ensure robust mapping (json-server _expand can differ based on naming)
            const [paymentsRes, ticketsRes] = await Promise.all([
                api.get<Payment[]>(url.replace('&_expand=ticket', '')), // Remove expand to save bandwidth if we manual fetch
                api.get<any[]>('/tickets')
            ]);

            const payments = paymentsRes as unknown as Payment[];
            const tickets = ticketsRes as unknown as any[];

            const allData = payments.map(p => {
                const ticket = tickets.find(t => t.id === p.ticket_id);
                return {
                    ...p,
                    ticket: ticket ? {
                        id: ticket.id,
                        code: ticket.code,
                        user_id: ticket.user_id
                    } : undefined
                };
            });

            // Calculate total
            const total = allData.length;

            // Manual Pagination
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedData = allData.slice(start, end);

            return {
                data: paginatedData,
                total: total
            };
        } catch (error) {
            console.error("Error fetching payments:", error);
            // Return empty structure on error to prevent crash
            return { data: [], total: 0 };
        }
    },

    getPaymentDetail: async (ticketId: string): Promise<PaymentDetail | null> => {
        try {
            // 1. Fetch Passenger via ticket_id
            const passengerRes = await api.get<any[]>(`/passengers?ticket_id=${ticketId}`);
            const passengers = passengerRes as unknown as any[];
            const passenger = passengers[0] || {};

            // 2. Fetch Ticket Info (Seat, Schedule -> Bus, Route)
            // Fetch ticket with schedule expanded
            let ticket: any = {};
            try {
                const ticketRes = await api.get<any>(`/tickets/${ticketId}?_expand=schedule`);
                ticket = ticketRes as unknown as any;
            } catch (e) {
                console.warn(`Failed to fetch ticket ${ticketId}`, e);
                return null;
            }

            let schedule = ticket.schedule;

            // Fallback: Fetch schedule manually if expand failed but ID exists
            if (!schedule && ticket.schedule_id) {
                try {
                    const scheduleRes = await api.get<any>(`/schedules/${ticket.schedule_id}`);
                    schedule = scheduleRes as unknown as any;
                } catch (e) {
                    console.warn("Failed to fetch schedule manually", e);
                }
            }

            schedule = schedule || {};

            // Fetch Seat Label explicitly from seat_positions (since seats resource is empty)
            let seatLabel = "Ghế thường";
            if (ticket.seat_id) {
                try {
                    const seatRes = await api.get<any>(`/seat_positions/${ticket.seat_id}`);
                    const seatData = seatRes as unknown as any;
                    if (seatData && seatData.label) {
                        seatLabel = seatData.label;
                    }
                } catch (e) {
                    console.warn("Failed to fetch seat position", e);
                }
            }

            let routeName = "Đang tải...";
            if (schedule.route_id) {
                try {
                    const routeRes = await api.get<any>(`/routes/${schedule.route_id}`);
                    const route = routeRes as unknown as any;

                    // Fetch Stations
                    if (route.departure_station_id && route.arrival_station_id) {
                        const [depRes, arrRes] = await Promise.all([
                            api.get<any>(`/stations/${route.departure_station_id}`),
                            api.get<any>(`/stations/${route.arrival_station_id}`)
                        ]);
                        const dep = depRes as unknown as any;
                        const arr = arrRes as unknown as any;
                        routeName = `${dep.station_name} → ${arr.station_name}`;
                    }
                } catch (e) {
                    routeName = "Tuyến xe";
                }
            }

            return {
                userInfo: {
                    name: passenger.full_name || "N/A",
                    email: passenger.email || "N/A",
                    phone: passenger.phone || "N/A",
                    passenger: `${passenger.full_name || ''} ${passenger.identity_number ? `| CCCD: ${passenger.identity_number}` : ''}`.trim() || "N/A"
                },
                ticketInfo: {
                    code: ticket.code,
                    route: routeName,
                    time: schedule.departure_time ? new Date(schedule.departure_time).toLocaleString('vi-VN') : "N/A",
                    seat: seatLabel,
                    status: ticket.status
                }
            };

        } catch (error) {
            console.error("Failed to fetch payment details", error);
            return null;
        }
    }
};

