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

interface Passenger {
    id: string;
    ticket_id: string;
    full_name: string;
    phone: string;
    email?: string;
    identity_number?: string;
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
    passengerInfo?: {
        fullName: string;
        phone: string;
        email: string;
    };
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
    },

    findTicket: async (code: string, phone: string): Promise<TicketUI | null> => {
        try {
            // 1. Find ticket by Code
            const ticketRes = await api.get<TicketResponse[]>(`/tickets?code=${code}`);
            const tickets = ticketRes as unknown as TicketResponse[];

            if (!tickets || tickets.length === 0) {
                return null;
            }

            const ticket = tickets[0];

            // 2. Verify Phone in Passengers
            const passengerRes = await api.get<Passenger[]>(`/passengers?ticket_id=${ticket.id}&phone=${phone}`);
            const passengers = passengerRes as unknown as Passenger[];

            const passenger = passengers.find(p => p.phone === phone);

            if (!passenger) {
                // Return null if phone doesn't match
                return null;
            }

            // 3. Fetch related data to build UI model
            // For a single ticket, we can fetch specific items or just fetch all like getMyTickets for simplicity 
            // given the mock DB structure. To ensure consistency with the display logic, we'll fetch necessary lists.
            // Optimization: In a real app, we'd have specific endpoints/joins.
            const [buses, routes, stations, schedules, cities, seatPositions, allSeats] = await Promise.all([
                api.get<Bus[]>(`/buses`),
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`),
                api.get<City[]>('/cities'),
                api.get<SeatPosition[]>('/seat_positions'),
                api.get<Seat[]>('/seats')
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const citiesArr = cities as unknown as City[];
            const seatPositionsArr = seatPositions as unknown as SeatPosition[];
            const allSeatsArr = allSeats as unknown as Seat[];

            // 4. Map Data
            const schedule = schedulesArr.find(s => s.id === ticket.schedule_id);
            if (!schedule) return null;

            const bus = busesArr.find(b => b.id === schedule.bus_id);
            const route = routesArr.find(r => r.id === schedule.route_id);

            // Fetch seats
            const seatSchedulesRes = await api.get<SeatSchedule[]>(`/seat_schedules?ticket_id=${ticket.id}`);
            const seatSchedules = seatSchedulesRes as unknown as SeatSchedule[];

            const seatNames = seatSchedules.map(s => {
                const sId = s.seat_id;
                if (!sId) return "Ghe";

                const pos = seatPositionsArr.find(p => p.id === sId);
                if (pos && pos.label) return pos.label;

                if (bus) {
                    const seat = allSeatsArr.find(st => st.id === sId && st.bus_id === bus.id);
                    if (seat) return seat.seat_label || seat.seat_number;
                }
                return s.seat_name || sId;
            });
            const uniqueSeatNames = Array.from(new Set(seatNames));

            const depStation = stationsArr.find(s => String(s.id) === String(route?.departure_station_id));
            const arrStation = stationsArr.find(s => String(s.id) === String(route?.arrival_station_id));

            const depCity = citiesArr.find(c => String(c.id) === String(depStation?.city_id));
            const arrCity = citiesArr.find(c => String(c.id) === String(arrStation?.city_id));

            const routeName = (depCity && arrCity)
                ? `${depCity.city_name} - ${arrCity.city_name}`
                : (depStation && arrStation)
                    ? `${depStation.station_name} - ${arrStation.station_name}`
                    : "Tuyến đường không xác định";

            const departureDate = new Date(schedule.departure_time);

            return {
                id: ticket.id,
                code: ticket.code || ticket.id,
                status: ticket.status,
                busInfo: {
                    id: bus?.id || "",
                    time: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    date: departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    name: bus?.name || "Xe khách",
                    route: routeName,
                    price: ticket.total_price || ticket.price,
                    type: "Giường nằm" // Should ideally fetch from vehicle_types
                },
                pickup: depStation?.station_name || "Điểm đón",
                dropoff: arrStation?.station_name || "Điểm trả",
                seats: uniqueSeatNames.length > 0 ? uniqueSeatNames : ["N/A"],
                passengerInfo: {
                    fullName: passenger.full_name,
                    phone: passenger.phone,
                    email: passenger.email || ""
                }
            };

        } catch (error) {
            console.error("Error finding ticket:", error);
            return null;
        }
    }
};
