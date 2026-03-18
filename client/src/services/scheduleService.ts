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
            // Backend does JOINs and returns enriched data with bus/route info
            const res: any = await api.get('/schedules', { params: { limit: 10000 } });
            const schedules: any[] = Array.isArray(res) ? res : (res?.data ?? []);

            const data = schedules.map(schedule => {
                return {
                    ...schedule,
                    route_name: schedule.route_name || (schedule.route ? schedule.route.route_name : `Route #${schedule.route_id}`),
                    bus_name: schedule.bus_name || (schedule.bus ? schedule.bus.name : `Bus #${schedule.bus_id}`),
                    bus_license: schedule.bus_license || (schedule.bus ? schedule.bus.license_plate : ''),
                    departure_time_str: new Date(schedule.departure_time).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                    }),
                    total_seats: schedule.calculated_total_seats ?? schedule.total_seats ?? 0,
                    available_seats: schedule.calculated_available_seats ?? schedule.available_seats ?? 0,
                    available_seat: schedule.calculated_available_seats ?? schedule.available_seats ?? 0,
                    schedule_id: schedule.id,
                    seat_schedules: schedule.seat_schedules || []
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
            const [schedulesRes, companiesRes] = await Promise.all([
                api.get<any[]>('/schedules'),
                api.get<any[]>('/bus-companies')
            ]);

            const schedules = schedulesRes as unknown as any[];
            const companies = companiesRes as unknown as any[];

            const companyNameMap = new Map(
                companies.map((c: any) => [String(c.id || c.bus_company_id), c.company_name])
            );

            const companyMap = new Map<string, CompanySeatAvailability>();

            (Array.isArray(schedules) ? schedules : []).forEach((schedule: any) => {
                if (schedule.status && schedule.status !== 'AVAILABLE') return;

                const companyId = schedule.bus_company_id || (schedule.bus ? (schedule.bus.bus_company_id ?? schedule.bus.company_id) : null);
                if (!companyId) return;

                const totalSeats = schedule.calculated_total_seats ?? schedule.total_seats ?? 0;
                const availableSeats = schedule.calculated_available_seats ?? schedule.available_seats ?? 0;

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
