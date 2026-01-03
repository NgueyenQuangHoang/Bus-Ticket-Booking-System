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
    name?: string; // Some routes might have names if defined
}

interface Station {
    id: string;
    station_name: string;
    city_id: string;
}

interface TicketResponse {
    id: string;
    user_id: string;
    schedule_id: string;
    seat_id: string;
    price: number;
    status: "BOOKED" | "COMPLETED" | "CANCELLED";
    code: string;
    created_at: string;
    updated_at: string;
    schedule?: Schedule; // Expanded from json-server
}

export interface TicketUI {
    id: string;
    code: string;
    busInfo: {
        id: string; // Bus ID
        time: string;
        date: string;
        name: string; // Bus Name or Company Name
        route: string;
        price: number;
        type: string; // Layout or Vehicle type
    };
    status: "BOOKED" | "COMPLETED" | "CANCELLED";
    pickup: string;
    dropoff: string;
    review?: Review; // Review if exists
}

export const ticketService = {
    getMyTickets: async (userId: string): Promise<TicketUI[]> => {
        try {
            // 1. Fetch tickets with schedule expanded
            const response = await api.get<TicketResponse[]>(
                `/tickets?user_id=${userId}&_sort=created_at&_order=desc`
            );
            const tickets = response as unknown as TicketResponse[];

            if (tickets.length === 0) return [];

            // 2. Parallel fetch related entities
            const [buses, routes, stations, schedules, reviews] = await Promise.all([
                api.get<Bus[]>(`/buses`), // Fetch all or filter if possible. json-server doesn't support "id_in" array param easily without query builder. fetching all for now is safer for small db.
                api.get<Route[]>(`/routes`),
                api.get<Station[]>(`/stations`),
                api.get<Schedule[]>(`/schedules`), // Fetch all schedules manually
                api.get<Review[]>(`/bus_reviews?user_id=${userId}`) // Fetch reviews for current user
            ]);

            const busesArr = buses as unknown as Bus[];
            const routesArr = routes as unknown as Route[];
            const stationsArr = stations as unknown as Station[];
            const schedulesArr = schedules as unknown as Schedule[];
            const reviewsArr = reviews as unknown as Review[];

            // 4. Map to UI Model
            const mappedTickets: TicketUI[] = [];

            for (const ticket of tickets) {
                // Manually find schedule
                const schedule = schedulesArr.find(s => s.id === ticket.schedule_id);

                // Skip if schedule is missing
                if (!schedule) {
                    console.warn(`Ticket ${ticket.id} missing schedule data (schedule_id: ${ticket.schedule_id})`);
                    continue;
                }

                const bus = busesArr.find(b => b.id === schedule.bus_id);
                const route = routesArr.find(r => r.id === schedule.route_id);

                const depStation = stationsArr.find(s => s.id === route?.departure_station_id);
                const arrStation = stationsArr.find(s => s.id === route?.arrival_station_id);

                // Mock route name if not present
                const routeName = (depStation && arrStation)
                    ? `${depStation.station_name} - ${arrStation.station_name}`
                    : "Tuyến đường không xác định";

                const departureDate = new Date(schedule.departure_time);

                // Find review for this ticket
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
                        price: ticket.price,
                        type: "Giường nằm" // Mocking type for now or fetch layout
                    },
                    pickup: depStation?.station_name || "Điểm đón",
                    dropoff: arrStation?.station_name || "Điểm trả",
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
