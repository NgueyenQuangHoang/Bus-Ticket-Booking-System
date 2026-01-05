import api from '../api/api';
import type { User } from '../types';
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
    created_at: string;
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
            const response = await api.get<TicketResponse[]>(`/tickets?user_id=${userId}&_sort=created_at&_order=desc`);
            const tickets = response as unknown as TicketResponse[];
            if (tickets.length === 0) return [];

            const [buses, routes, stations, schedules, reviews, cities, seatPositions, allSeats] = await Promise.all([
                api.get<Bus[]>(`/buses`),
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`),
                api.get<Review[]>(`/bus_reviews?user_id=${userId}`),
                api.get<City[]>('/cities'),
                api.get<SeatPosition[]>('/seat_positions'),
                api.get<Seat[]>('/seats'),
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const reviewsArr = reviews as unknown as Review[];
            const citiesArr = cities as unknown as City[];
            const seatPositionsArr = seatPositions as unknown as SeatPosition[];
            const allSeatsArr = allSeats as unknown as Seat[];

            const mappedTickets: TicketUI[] = [];

            for (const ticket of tickets) {
                const schedule = schedulesArr.find(s => s.id === ticket.schedule_id);
                if (!schedule) {
                    console.warn(`Ticket ${ticket.id} missing schedule data`);
                    continue;
                }

                const bus = busesArr.find(b => b.id === schedule.bus_id);
                const route = routesArr.find(r => r.id === schedule.route_id);

                const seatSchedulesRes = await api.get<SeatSchedule[]>(`/seat_schedules?ticket_id=${ticket.id}`);
                const seatSchedules = (seatSchedulesRes as unknown as SeatSchedule[]).filter(ss => ss.ticket_id === ticket.id);

                if (seatSchedules.length === 0 && ticket.seat_id) {
                    const pos = seatPositionsArr.find(p => p.id === ticket.seat_id);
                    seatSchedules.push({
                        id: 'temp_' + ticket.id,
                        schedule_id: ticket.schedule_id,
                        ticket_id: ticket.id,
                        status: ticket.status,
                        price: ticket.price,
                        seat_id: ticket.seat_id,
                        seat_name: pos?.label
                    } as SeatSchedule);
                }

                const seatNames = seatSchedules.map(s => {
                    const sId = s.seat_id;
                    if (!sId) return "Ghe";

                    const pos = seatPositionsArr.find(p => p.id === sId);
                    if (pos?.label) return pos.label;

                    if (bus) {
                        const seat = allSeatsArr.find(st => st.id === sId && st.bus_id === bus.id);
                        if (seat) return seat.seat_label || seat.seat_number;
                    }
                    return s.seat_name || sId;
                });
                const uniqueSeatNames = Array.from(new Set(seatNames));

                const depStation = stationsArr.find(s => s.id === route?.departure_station_id);
                const arrStation = stationsArr.find(s => s.id === route?.arrival_station_id);
                const depCity = citiesArr.find(c => c.id === depStation?.city_id);
                const arrCity = citiesArr.find(c => c.id === arrStation?.city_id);

                const routeName = (depCity && arrCity)
                    ? `${depCity.city_name} - ${arrCity.city_name}`
                    : (depStation && arrStation)
                        ? `${depStation.station_name} - ${arrStation.station_name}`
                        : "Tuyến đường không xác định";

                const departureDate = new Date(schedule.departure_time);
                const isPast = departureDate < new Date();
                let uiStatus = ticket.status;
                if (ticket.status === 'BOOKED' && isPast) {
                    uiStatus = 'COMPLETED';
                    api.patch(`/tickets/${ticket.id}`, {
                        status: 'COMPLETED',
                        updated_at: new Date().toISOString()
                    }).catch(console.error);
                }

                const review = reviewsArr.find(r => r.ticket_id === ticket.id);

                mappedTickets.push({
                    id: ticket.id,
                    code: ticket.code || ticket.id,
                    status: uiStatus,
                    busInfo: {
                        id: bus?.id || "",
                        time: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        date: departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                        name: bus?.name || "Xe khách",
                        route: routeName,
                        price: ticket.total_price || ticket.price,
                        type: "Giường nằm"
                    },
                    pickup: depStation?.station_name || "Điểm đón",
                    dropoff: arrStation?.station_name || "Điểm trả",
                    seats: uniqueSeatNames.length > 0 ? uniqueSeatNames : ["N/A"],
                    review: review,
                    created_at: ticket.created_at
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
            const seatSchedulesRaw = seatSchedulesRes as unknown as SeatSchedule[];
            // Strict filtering to ensure no cross-matching occurs
            const seatSchedules = seatSchedulesRaw.filter(ss => ss.ticket_id === ticket.id);

            // Fallback: If no seat_schedules found but ticket has seat_id (Legacy/Manual data support)
            if (seatSchedules.length === 0 && ticket.seat_id) {
                // Try to finding label directly from seat_positions
                const pos = seatPositionsArr.find(p => p.id === ticket.seat_id);
                seatSchedules.push({
                    id: 'temp_' + ticket.id,
                    schedule_id: ticket.schedule_id,
                    ticket_id: ticket.id,
                    status: ticket.status,
                    price: ticket.price,
                    seat_id: ticket.seat_id,
                    seat_name: pos?.label // Use label from seat_positions if found
                } as SeatSchedule);
            }

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

            const isPast = departureDate < new Date();
            let uiStatus = ticket.status;

            if (ticket.status === 'BOOKED' && isPast) {
                uiStatus = 'COMPLETED';
                // Auto-update status in DB
                api.patch(`/tickets/${ticket.id}`, {
                    status: 'COMPLETED',
                    updated_at: new Date().toISOString()
                }).catch(console.error);
            }

            return {
                id: ticket.id,
                code: ticket.code || ticket.id,
                status: uiStatus,
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
                },
                created_at: ticket.created_at
            };

        } catch (error) {
            console.error("Error finding ticket:", error);
            return null;
        }
    },
    getAllTickets: async (allowedBusIds: string[] = []): Promise<TicketUI[]> => {
        try {
            // 1. Fetch all tickets
            const response = await api.get<TicketResponse[]>(
                `/tickets?_sort=created_at&_order=desc`
            );
            const tickets = response as unknown as TicketResponse[];

            if (tickets.length === 0) return [];

            // 2. Parallel fetch related entities
            const [buses, routes, stations, schedules, cities, seatPositions, allSeats, allUser] = await Promise.all([
                api.get<Bus[]>(`/buses`),
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`),
                api.get<City[]>('/cities'),
                api.get<SeatPosition[]>('/seat_positions'),
                api.get<Seat[]>('/seats'),
                api.get<User[]>('/users')
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const citiesArr = cities as unknown as City[];
            const seatPositionsArr = seatPositions as unknown as SeatPosition[];
            const allSeatsArr = allSeats as unknown as Seat[];
            const users = allUser as unknown as User[]

            // 3. Map to UI Model
            const mappedTickets: TicketUI[] = [];

            for (const ticket of tickets) {
                const schedule = schedulesArr.find(s => s.id === ticket.schedule_id);

                if (!schedule) {
                    console.warn(`Ticket ${ticket.id} missing schedule data`);
                    continue;
                }

                const bus = busesArr.find(b => b.id === schedule.bus_id);

                if (allowedBusIds.length > 0 && (!bus || !allowedBusIds.includes(String(bus.id)))) {
                    continue;
                }
                const route = routesArr.find(r => r.id === schedule.route_id);

                const seatSchedulesRes = await api.get<SeatSchedule[]>(`/seat_schedules?ticket_id=${ticket.id}`);
                const seatSchedules = seatSchedulesRes as unknown as SeatSchedule[];

                // Fallback: If no seat_schedules found but ticket has seat_id (Legacy/Manual data support)
                if (seatSchedules.length === 0 && ticket.seat_id) {
                    // Try to finding label directly from seat_positions
                    const pos = seatPositionsArr.find(p => p.id === ticket.seat_id);
                    seatSchedules.push({
                        id: 'temp_' + ticket.id,
                        schedule_id: ticket.schedule_id,
                        ticket_id: ticket.id,
                        status: ticket.status,
                        price: ticket.price,
                        seat_id: ticket.seat_id,
                        seat_name: pos?.label // Use label from seat_positions if found
                    } as SeatSchedule);
                }

                const seatNames = seatSchedules.map(s => {
                    const sId = s.seat_id;
                    if (!sId) return "Ghe";

                    const pos = seatPositionsArr.find(p => p.id === sId);
                    if (pos && pos.label) {
                        return pos.label;
                    }

                    if (bus) {
                        const seat = allSeatsArr.find(st => st.id === sId && st.bus_id === bus.id);
                        if (seat) return seat.seat_label || seat.seat_number;
                    }

                    return s.seat_name || sId;
                });

                const uniqueSeatNames = Array.from(new Set(seatNames));

                const depStation = stationsArr.find(s => s.id === route?.departure_station_id);
                const arrStation = stationsArr.find(s => s.id === route?.arrival_station_id);

                const depCity = citiesArr.find(c => c.id === depStation?.city_id);
                const arrCity = citiesArr.find(c => c.id === arrStation?.city_id);
                const user = users.find(u => u.id === ticket.user_id)

                const routeName = (depCity && arrCity)
                    ? `${depCity.city_name} - ${arrCity.city_name}`
                    : (depStation && arrStation)
                        ? `${depStation.station_name} - ${arrStation.station_name}`
                        : "Tuyến đường không xác định";

                const departureDate = new Date(schedule.departure_time);
                const isPast = departureDate < new Date();
                let uiStatus = ticket.status;

                if (ticket.status === 'BOOKED' && isPast) {
                    uiStatus = 'COMPLETED';
                    api.patch(`/tickets/${ticket.id}`, {
                        status: 'COMPLETED',
                        updated_at: new Date().toISOString()
                    }).catch(console.error);
                }

                // Note: Not fetching specific reviews for ALL tickets to avoid massive N+1 or huge payload.
                // Admin can view details if needed.

                mappedTickets.push({
                    id: ticket.id,
                    code: ticket.code || ticket.id,
                    status: uiStatus,
                    busInfo: {
                        id: bus?.id || "",
                        time: departureDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        date: departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                        name: bus?.name || "Xe khách",
                        route: routeName,
                        price: ticket.total_price || ticket.price,
                        type: "Giường nằm"
                    },
                    pickup: depStation?.station_name || "Điểm đón",
                    dropoff: arrStation?.station_name || "Điểm trả",
                    seats: uniqueSeatNames.length > 0 ? uniqueSeatNames : ["N/A"],
                    passengerInfo: {
                        email: user?.email || '',
                        fullName: user ? user.first_name + " " + user.last_name : '',
                        phone: user?.phone || ""
                    },
                    created_at: ticket.created_at
                });
            }

            return mappedTickets;

        } catch (error) {
            console.error("Error fetching all tickets:", error);
            return [];
        }
    }
};
