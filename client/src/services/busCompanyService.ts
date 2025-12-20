import api from "./api";
import type { BusCompany } from "../types";

export const busCompanyService = {
    getAllBusCompanies: async (): Promise<BusCompany[]> => {
        try {
            const response = await api.get('/bus-companies');
            return response.data;
        } catch (error) {
            console.error('Error fetching bus companies:', error);
            throw error;
        }
    },
    getPopularBusCompanies: async (limit: number = 5): Promise<BusCompany[]> => {
        try {
            const response = await api.get(`/bus_companies?_sort=rating&_order=desc&_limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular bus companies:', error);
            throw error;
        }
    }
}