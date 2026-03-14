import api from '../api/api';
import type { Review } from './reviewService';

export interface TicketUI {
    id: string;
    code: string;
    busInfo: {
        id: string;
        time: string;
        date: string;
        name: string;
        route: string;
        price: number;
        type: string;
    };
    status: "BOOKED" | "COMPLETED" | "CANCELLED" | "PENDING";
    pickup: string;
    dropoff: string;
    seats: string[]; // Added seats array
    review?: Review;
    passengerInfo?: {
        fullName: string;
        phone: string;
        email: string;
    };
    created_at: string;
}

// Backend response shape from /tickets/my-tickets
interface MyTicketResponse {
    id: string;
    code: string;
    price: number;
    total_price?: number;
    status: "BOOKED" | "COMPLETED" | "CANCELLED" | "PENDING";
    created_at: string;
    departure_time: string;
    arrival_time: string;
    bus_id?: string;
    bus_name?: string;
    base_price?: number;
    pickup?: string;
    dropoff?: string;
    dep_city?: string;
    arr_city?: string;
    seats?: string[];
    seat_names?: string[];
    review?: Review;
    passenger_name?: string;
    passenger_phone?: string;
    passenger_email?: string;
}

// Backend response shape from /tickets/find
interface FindTicketResponse {
    id: string;
    code: string;
    price: number;
    total_price?: number;
    status: "BOOKED" | "COMPLETED" | "CANCELLED" | "PENDING";
    created_at: string;
    departure_time: string;
    arrival_time: string;
    bus_id?: string;
    bus_name?: string;
    pickup?: string;
    dropoff?: string;
    dep_city?: string;
    arr_city?: string;
    seats?: string[];
    seat_names?: string[];
    passenger_name?: string;
    passenger_phone?: string;
    passenger_email?: string;
}

function mapToTicketUI(t: MyTicketResponse | FindTicketResponse): TicketUI {
    const departureDate = new Date(t.departure_time);
    const routeName = (t.dep_city && t.arr_city)
        ? `${t.dep_city} - ${t.arr_city}`
        : (t.pickup && t.dropoff)
            ? `${t.pickup} - ${t.dropoff}`
            : "Tuyến đường không xác định";

    return {
        id: t.id,
        code: t.code || t.id,
        status: t.status,
        busInfo: {
            id: t.bus_id || "",
            time: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            date: departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            name: t.bus_name || "Xe khách",
            route: routeName,
            price: t.total_price || t.price,
            type: "Giường nằm"
        },
        pickup: t.pickup || "Điểm đón",
        dropoff: t.dropoff || "Điểm trả",
        seats: (t.seat_names && t.seat_names.length > 0) ? t.seat_names : (t.seats && t.seats.length > 0) ? t.seats : ["N/A"],
        review: 'review' in t ? t.review : undefined,
        passengerInfo: {
            fullName: t.passenger_name || '',
            phone: t.passenger_phone || '',
            email: t.passenger_email || ''
        },
        created_at: t.created_at
    };
}

export const ticketService = {
    cancelTicket: async (ticketId: string): Promise<any> => {
        try {
            // Backend handles seat_schedule cleanup in a transaction
            const response = await api.patch(`/tickets/${ticketId}/cancel`, {});
            return response;
        } catch (error) {
            console.error("Error cancelling ticket:", error);
            throw error;
        }
    },

    getMyTickets: async (userId: string): Promise<TicketUI[]> => {
        try {
            // Backend does all JOINs server-side, returns enriched data
            const response: MyTicketResponse[] = await api.get('/tickets/my-tickets');

            if (!Array.isArray(response) || response.length === 0) return [];

            return response.map(mapToTicketUI);
        } catch (error) {
            console.error("Error fetching my tickets:", error);
            return [];
        }
    },

    findTicket: async (code: string, phone: string): Promise<TicketUI | null> => {
        try {
            const response: FindTicketResponse = await api.get(
                `/tickets/find?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`
            );

            if (!response) return null;

            return mapToTicketUI(response);
        } catch (error) {
            console.error("Error finding ticket:", error);
            return null;
        }
    },

    getAllTickets: async (allowedBusIds: string[] = []): Promise<TicketUI[]> => {
        try {
            let url = '/tickets?sort=created_at&order=desc';

            if (allowedBusIds.length > 0) {
                url += `&busIds=${allowedBusIds.join(',')}`;
            }

            const response: MyTicketResponse[] = await api.get(url);

            if (!Array.isArray(response) || response.length === 0) return [];

            return response.map(mapToTicketUI);
        } catch (error) {
            console.error("Error fetching all tickets:", error);
            return [];
        }
    }
};
