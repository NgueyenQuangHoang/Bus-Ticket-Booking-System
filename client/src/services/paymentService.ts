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
            // Backend handles pagination, filtering, and sorting
            let url = `/payments?page=${page}&limit=${limit}`;

            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            if (filter && filter !== 'ALL') {
                url += `&status=${filter}`;
            }

            const response: any = await api.get(url);

            // api interceptor returns { data, total } for paginated responses
            const payments = response.data || response;
            const total = response.total || (Array.isArray(payments) ? payments.length : 0);

            return {
                data: Array.isArray(payments) ? payments : [],
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
            // Backend returns enriched detail with all JOINs done server-side
            const response: any = await api.get(`/payments/${ticketId}/detail`);

            if (!response) return null;

            // Map backend response to PaymentDetail interface
            // Backend may return the data already in this format, or we map it
            return {
                userInfo: {
                    name: response.userInfo?.name || response.passenger_name || "N/A",
                    email: response.userInfo?.email || response.passenger_email || "N/A",
                    phone: response.userInfo?.phone || response.passenger_phone || "N/A",
                    passenger: response.userInfo?.passenger || response.passenger_info || "N/A"
                },
                ticketInfo: {
                    code: response.ticketInfo?.code || response.ticket_code || "",
                    route: response.ticketInfo?.route || response.route_name || "N/A",
                    time: response.ticketInfo?.time || (response.departure_time ? new Date(response.departure_time).toLocaleString('vi-VN') : "N/A"),
                    seat: response.ticketInfo?.seat || response.seat_label || "Ghế thường",
                    status: response.ticketInfo?.status || response.ticket_status || ""
                }
            };

        } catch (error) {
            console.error("Failed to fetch payment details", error);
            return null;
        }
    }
};
