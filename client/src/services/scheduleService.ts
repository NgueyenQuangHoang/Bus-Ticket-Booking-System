import api from '../api/api';
import type { ScheduleUI } from '../pages/admin/schedules/components/ScheduleTable';

export interface CompanySeatAvailability {
    company_id: string;
    company_name?: string;
    available_seats: number;
    total_seats: number;
    schedule_count: number;
}

export const scheduleService = {
    getAllSchedules: async (): Promise<ScheduleUI[]> => {
        try {
            // Fetch schedules with related data
            const schedulesRes = await api.get<any[]>('/schedules?_expand=bus&_expand=route&_embed=seat_schedules');
            // Fetch all seats to calculate capacity
            const seatsRes = await api.get<any[]>('/seats');

            const schedules = schedulesRes as unknown as any[];
            const allSeats = seatsRes as unknown as any[];

            const data = schedules.map(schedule => {
                // Calculate Total Seats (Bookable) for this bus
                // Filter seats by bus_id and check availability flag
                const busSeats = allSeats.filter(s =>
                    String(s.bus_id) === String(schedule.bus_id) &&
                    s.is_available_for_booking === true
                );
                // Fallback to schedule.total_seats if no physical seats found (e.g. mock data or missing bus)
                const totalSeats = busSeats.length > 0 ? busSeats.length : (schedule.total_seats || 0);

                // Calculate Busy Seats from seat_schedules
                // Filter out entries that are explicitly 'AVAILABLE' (if any)
                // Assuming presence in seat_schedules usually means interaction (booked/held),
                // but checking status is safer as user requested.
                // Common busy statuses: BOOKED, SOLD, HOLD, PENDING, COMPLETED, etc.
                const busySeats = schedule.seat_schedules ? schedule.seat_schedules.filter((ss: any) =>
                    ss.status !== 'AVAILABLE' && ss.status !== 'CANCELLED'
                ).length : 0;

                const availableSeats = Math.max(0, totalSeats - busySeats);

                return {
                    ...schedule,
                    route_name: schedule.route ? schedule.route.route_name : `Route #${schedule.route_id}`,
                    bus_name: schedule.bus ? schedule.bus.name : `Bus #${schedule.bus_id}`,
                    bus_license: schedule.bus ? schedule.bus.license_plate : '',
                    departure_time_str: new Date(schedule.departure_time).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                    }),
                    total_seats: totalSeats,
                    available_seats: availableSeats,
                    available_seat: availableSeats, // For backward compatibility if needed
                    schedule_id: schedule.id
                };
            });

            return data as ScheduleUI[];
        } catch (error) {
            console.error('Error fetching schedules:', error);
            throw error;
        }
    },

    getAvailableSeatsByCompany: async (): Promise<CompanySeatAvailability[]> => {
        try {
            const [schedulesRes, seatsRes, companiesRes] = await Promise.all([
                api.get<any[]>('/schedules?_expand=bus&_embed=seat_schedules'),
                api.get<any[]>('/seats'),
                api.get<any[]>('/bus_companies')
            ]);

            const schedules = schedulesRes as unknown as any[];
            const allSeats = seatsRes as unknown as any[];
            const companies = companiesRes as unknown as any[];

            const companyNameMap = new Map(
                companies.map((c: any) => [String(c.id || c.bus_company_id), c.company_name])
            );

            const companyMap = new Map<string, CompanySeatAvailability>();

            schedules.forEach((schedule: any) => {
                if (schedule.status && schedule.status !== 'AVAILABLE') return;

                const bus = schedule.bus;
                if (!bus) return;

                const companyId = bus.bus_company_id ?? bus.company_id;
                if (!companyId) return;

                const busSeats = allSeats.filter((s: any) =>
                    String(s.bus_id) === String(schedule.bus_id) &&
                    s.is_available_for_booking === true
                );
                const totalSeats = busSeats.length > 0 ? busSeats.length : (schedule.total_seats || 0);

                const busySeats = schedule.seat_schedules
                    ? schedule.seat_schedules.filter((ss: any) =>
                        ss.status !== 'AVAILABLE' && ss.status !== 'CANCELLED'
                    ).length
                    : 0;

                const availableSeats = Math.max(0, totalSeats - busySeats);

                const key = String(companyId);
                const current = companyMap.get(key) || {
                    company_id: key,
                    company_name: companyNameMap.get(key),
                    available_seats: 0,
                    total_seats: 0,
                    schedule_count: 0
                };

                current.available_seats += availableSeats;
                current.total_seats += totalSeats;
                current.schedule_count += 1;
                if (!current.company_name) {
                    current.company_name = companyNameMap.get(key);
                }

                companyMap.set(key, current);
            });

            return Array.from(companyMap.values());
        } catch (error) {
            console.error('Error fetching available seats by company:', error);
            throw error;
        }
    },

    createSchedule: async (data: Partial<ScheduleUI>): Promise<ScheduleUI> => {
        try {
            const response = await api.post<ScheduleUI>('/schedules', data);
            return response as unknown as ScheduleUI;
        } catch (error) {
            console.error('Error creating schedule:', error);
            throw error;
        }
    },

    updateSchedule: async (id: number | string, data: Partial<ScheduleUI>): Promise<ScheduleUI> => {
        try {
            const response = await api.put<ScheduleUI>(`/schedules/${id}`, data);
            return response as unknown as ScheduleUI;
        } catch (error) {
            console.error(`Error updating schedule ${id}:`, error);
            throw error;
        }
    },

    deleteSchedule: async (id: number | string): Promise<void> => {
        try {
            await api.delete(`/schedules/${id}`);
        } catch (error) {
            console.error(`Error deleting schedule ${id}:`, error);
            throw error;
        }
    }
};
