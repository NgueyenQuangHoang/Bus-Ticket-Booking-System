import api from "./api";
import type { Route } from "../types";
export const routesService = {
    getAllRoutes: async (): Promise<Route[]> => {
        try {
            const response = await api.get('/routes');
            return response.data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    },
    getPopularRoutes: async (limit: number = 5): Promise<Route[]> => {
        try {
            const response = await api.get(`/routes?_sort=total_bookings&_order=desc&_limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular routes:', error);
            throw error;
        }
    }
}