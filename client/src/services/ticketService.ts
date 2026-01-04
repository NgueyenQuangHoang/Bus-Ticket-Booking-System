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

interface City {
    id: string;
    city_name: string;
}

interface SeatPosition {
    id: string;
    label: string;
}

interface Seat {
    id: string;
    seat_label: string;
    seat_number: string;
    bus_id: string;
}

interface SeatSchedule {
    id: string;
    schedule_id: string;
    seat_name?: string;
    ticket_id: string;
    status: string;
    price: number;
    seat_id?: string;
}

interface TicketResponse {
    id: string;
    user_id?: string;
    schedule_id: string;
    seat_id?: string;
    price: number;
    total_price?: number;
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
            const [buses, routes, stations, schedules, reviews, cities, seatPositions, allSeats] = await Promise.all([
                api.get<Bus[]>(`/buses`),
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`),
                api.get<Review[]>(`/bus_reviews?user_id=${userId}`),
                api.get<City[]>('/cities'),
                api.get<SeatPosition[]>('/seat_positions'),
                api.get<Seat[]>('/seats')
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const reviewsArr = reviews as unknown as Review[];
            const citiesArr = cities as unknown as City[];
            const seatPositionsArr = seatPositions as unknown as SeatPosition[];
            const allSeatsArr = allSeats as unknown as Seat[];

            // 3. Map to UI Model
            const mappedTickets: TicketUI[] = [];

            for (const ticket of tickets) {
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

                // Fetch seats for this ticket
                const seatSchedulesRes = await api.get<SeatSchedule[]>(`/seat_schedules?ticket_id=${ticket.id}`);
                const seatSchedules = seatSchedulesRes as unknown as SeatSchedule[];

                // Match seat IDs to real labels
                const seatNames = seatSchedules.map(s => {
                    const sId = s.seat_id;
                    if (!sId) return "Ghe";

                    // 1. Try finding in seat_positions (Validation: check layout_id matches bus.layout_id)
                    // We only accept seat_positions that match the bus's layout
                    const pos = seatPositionsArr.find(p => p.id === sId);
                    if (pos && pos.label) {
                        // Optional: Validate pos.layout_id === bus?.layout_id
                        // But sometimes layouts are shared or templates. 
                        // If we found a specific position ID, it's likely correct.
                        return pos.label;
                    }

                    // 2. Try finding in seats (Validation: MUST match bus_id)
                    // IDs might be "1", "2" which are common. Must filter by bus.
                    if (bus) {
                        const seat = allSeatsArr.find(st => st.id === sId && st.bus_id === bus.id);
                        if (seat) return seat.seat_label || seat.seat_number;
                    }

                    // Fallback to existing seat_name or ID
                    return s.seat_name || sId;
                });

                // Deduplicate seats
                const uniqueSeatNames = Array.from(new Set(seatNames));

                const depStation = stationsArr.find(s => s.id === route?.departure_station_id);
                const arrStation = stationsArr.find(s => s.id === route?.arrival_station_id);

                // Resolve Cities
                const depCity = citiesArr.find(c => c.id === depStation?.city_id);
                const arrCity = citiesArr.find(c => c.id === arrStation?.city_id);

                const routeName = (depCity && arrCity)
                    ? `${depCity.city_name} - ${arrCity.city_name}`
                    : (depStation && arrStation)
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
                    seats: uniqueSeatNames.length > 0 ? uniqueSeatNames : ["N/A"],
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
