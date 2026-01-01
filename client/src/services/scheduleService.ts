import api from '../api/api';
import type { ScheduleUI } from '../pages/admin/schedules/components/ScheduleTable';

export const scheduleService = {
    getAllSchedules: async (): Promise<ScheduleUI[]> => {
        try {
            const response = await api.get<ScheduleUI[]>('/schedules');
            return response as unknown as ScheduleUI[];
        } catch (error) {
            console.error('Error fetching schedules:', error);
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
