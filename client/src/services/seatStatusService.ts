import api from '../api/api';

export interface Route {
  id: string;
  departure_station_id: string;
  arrival_station_id: string;
  description: string;
  // Add other fields if needed for display like station names (might need to fetch stations or just show IDs/description for now)
}

export interface Schedule {
  id: string;
  route_id: string;
  bus_id: string;
  departure_time: string;
  arrival_time: string;
  total_seats: number;
  available_seats: number;
  status: string;
}

export interface SeatPosition {
    id: string;
    seat_id?: string; // Some might associate directly
    layout_id: string;
    floor: number;
    row_index: number;
    column_index: number;
    is_driver_seat: boolean;
    is_door: boolean;
    is_stair: boolean;
    label?: string;
    seat_type_id?: string | number;
    rotation?: number;
    is_aisle?: boolean;
}

export interface SeatSchedule {
  id: string;
  seat_id: string;
  schedule_id: string;
  status: 'BOOKED' | 'HOLD' | 'AVAILABLE';
  hold_expired_at?: string;
  user_id?: string;
}

export interface Bus {
  id: string;
  name: string;
  layout_id: string;
  bus_company_id: string;
}

export interface SeatStatusData {
  position: SeatPosition;
  status: 'AVAILABLE' | 'BOOKED' | 'HOLD';
  ticket_id?: string;
}

export const seatStatusService = {
  // Fetch all routes for the dropdown
  getRoutes: async (): Promise<Route[]> => {
    const response = await api.get<Route[]>('/routes');
    return response as unknown as Route[];
  },

  // Fetch schedules for a specific route
  getSchedulesByRoute: async (routeId: string): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>(`/schedules?route_id=${routeId}`);
    return response as unknown as Schedule[];
  },

  // Main function to get the full seat map with status
  getSeatStatusBySchedule: async (scheduleId: string): Promise<{
    layoutId: string;
    seats: SeatStatusData[];
    totalSeats: number;
    booked: number;
    held: number;
    available: number;
  }> => {
    try {
        // 1. Get Schedule to find Bus
        const scheduleRes = await api.get<Schedule>(`/schedules/${scheduleId}`);
        const schedule = scheduleRes as unknown as Schedule;
        
        if (!schedule) throw new Error("Schedule not found");

        // 2. Get Bus to find Layout
        const busRes = await api.get<Bus>(`/buses/${schedule.bus_id}`);
        const bus = busRes as unknown as Bus;
        
        if (!bus) throw new Error("Bus not found");

         // 3. Get Seat Positions for the Layout
        const positionsRes = await api.get<SeatPosition[]>(`/seat_positions?layout_id=${bus.layout_id}`);
        const positions = positionsRes as unknown as SeatPosition[];

        // 4. Get Statuses from seat_schedule
        const statusesRes = await api.get<SeatSchedule[]>(`/seat_schedules?schedule_id=${scheduleId}`);
        const seatStatuses = statusesRes as unknown as SeatSchedule[];

        // 5. Merge Data
        // Create a map for quick lookup of status by seat_id (assuming seat_position.id matches seat_schedule.seat_id)
        // Note: In db.json, seat_schedule.seat_id seems to match seat_position.id (e.g. "ff4c")
        const statusMap = new Map<string, SeatSchedule>();
        seatStatuses.forEach(s => statusMap.set(String(s.seat_id), s));

        const resultSeats: SeatStatusData[] = positions.map(pos => {
            const statusRecord = statusMap.get(pos.id);
            let status: 'AVAILABLE' | 'BOOKED' | 'HOLD' = 'AVAILABLE';
            
            if (statusRecord) {
                // If it's HOLD, check expiry
                if (statusRecord.status === 'HOLD' && statusRecord.hold_expired_at) {
                    if (new Date(statusRecord.hold_expired_at) > new Date()) {
                        status = 'HOLD';
                    } else {
                         // Expired hold becomes available
                         status = 'AVAILABLE';
                    }
                } else if (statusRecord.status === 'BOOKED') {
                    status = 'BOOKED';
                }
            }

            return {
                position: pos,
                status: status,
                ticket_id: undefined // Could fetch if needed
            };
        });

        // Calculate summary
        // Note: We only count "seats" related to passengers, filtering out driver/door/aisle if necessary?
        // Usually driver/door/stair don't have status, but let's count based on resultSeats status
        const booked = resultSeats.filter(s => s.status === 'BOOKED' && !s.position.is_driver_seat && !s.position.is_door && !s.position.is_stair && !s.position.is_aisle).length;
        const held = resultSeats.filter(s => s.status === 'HOLD' && !s.position.is_driver_seat).length;
        // Total sellable seats
        const sellableSeats = resultSeats.filter(s => !s.position.is_driver_seat && !s.position.is_door && !s.position.is_stair && !s.position.is_aisle).length;
        const available = sellableSeats - booked - held;

        return {
            layoutId: bus.layout_id,
            seats: resultSeats,
            totalSeats: sellableSeats,
            booked,
            held,
            available
        };

    } catch (error) {
        console.error("Error fetching seat status details:", error);
        throw error;
    }
  }
};
