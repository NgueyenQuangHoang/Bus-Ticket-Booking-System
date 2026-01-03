import api from '../api/api';
import type { Review } from './reviewService';

// Interfaces mapping to db.json structure
interface Schedule {
    id: string;
    route_id: string;
    bus_id: string;
    departure_time: string;
    arrival_time: string;
    status: string;
}

interface Bus {
    id: string;
    name: string;
    bus_company_id: string;
    layout_id?: string;
    license_plate?: string;
}

interface Route {
    id: string;
    departure_station_id: string;
    arrival_station_id: string;
    duration: number;
    base_price: number;
    name?: string;
}

interface Station {
    id: string;
    station_name: string;
    city_id: string;
}

interface SeatSchedule {
    id: string;
    schedule_id: string;
    seat_name: string;
    ticket_id: string;
    status: string;
    price: number;
}

interface TicketResponse {
    id: string;
    user_id: string;
    schedule_id: string;
    // seat_id: string; // Removed
    price: number;
    total_price?: number; // Added to match new schema
    status: "BOOKED" | "COMPLETED" | "CANCELLED" | "PENDING";
    code: string;
    created_at: string;
    updated_at: string;
    schedule?: Schedule;
}

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
}

export const ticketService = {
    cancelTicket: async (ticketId: string): Promise<TicketResponse> => {
        try {
            const response = await api.patch<TicketResponse>(`/tickets/${ticketId}`, {
                status: "CANCELLED",
                updated_at: new Date().toISOString()
            });
            // Also cancel seat schedules?? Ideally yes, but keeping it simple for now or separate call.
            return response as unknown as TicketResponse;
        } catch (error) {
            console.error("Error cancelling ticket:", error);
            throw error;
        }
    },

    getMyTickets: async (userId: string): Promise<TicketUI[]> => {
        try {
            // 1. Fetch tickets
            const response = await api.get<TicketResponse[]>(
                `/tickets?user_id=${userId}&_sort=created_at&_order=desc`
            );
            const tickets = response as unknown as TicketResponse[];

            if (tickets.length === 0) return [];

            // 2. Parallel fetch related entities
            const [buses, routes, stations, schedules, reviews] = await Promise.all([
                api.get<Bus[]>(`/buses`),
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`),
                api.get<Review[]>(`/bus_reviews?user_id=${userId}`)
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const reviewsArr = reviews as unknown as Review[];

            // 3. Map to UI Model
            const mappedTickets: TicketUI[] = [];

            for (const ticket of tickets) {
                // Fetch seats for this ticket
                const seatSchedulesRes = await api.get<SeatSchedule[]>(`/seat_schedules?ticket_id=${ticket.id}`);
                const seatSchedules = seatSchedulesRes as unknown as SeatSchedule[];
                const seatNames = seatSchedules.map(s => s.seat_name);

                // Manually find schedule
                const schedule = schedulesArr.find(s => s.id === ticket.schedule_id);

                // If schedule is missing, we might still want to show the ticket with warning or skip
                // Skipping for now to avoid crashes
                if (!schedule) {
                    console.warn(`Ticket ${ticket.id} missing schedule data`);
                    continue;
                }

                const bus = busesArr.find(b => b.id === schedule.bus_id);
                const route = routesArr.find(r => r.id === schedule.route_id);

                const depStation = stationsArr.find(s => s.id === route?.departure_station_id);
                const arrStation = stationsArr.find(s => s.id === route?.arrival_station_id);

                const routeName = (depStation && arrStation)
                    ? `${depStation.station_name} - ${arrStation.station_name}`
                    : "Tuyến đường không xác định";

                const departureDate = new Date(schedule.departure_time);

                const review = reviewsArr.find(r => r.ticket_id === ticket.id);

                mappedTickets.push({
                    id: ticket.id,
                    code: ticket.code || ticket.id,
                    status: ticket.status,
                    busInfo: {
                        id: bus?.id || "",
                        time: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        date: departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                        name: bus?.name || "Xe khách",
                        route: routeName,
                        price: ticket.total_price || ticket.price, // use total_price if available
                        type: "Giường nằm"
                    },
                    pickup: depStation?.station_name || "Điểm đón",
                    dropoff: arrStation?.station_name || "Điểm trả",
                    seats: seatNames.length > 0 ? seatNames : ["N/A"],
                    review: review
                });
            }

            return mappedTickets;

        } catch (error) {
            console.error("Error fetching my tickets:", error);
            return [];
        }
    }
};
