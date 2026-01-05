import api from "../api/api";
import type { BusCompany } from "../types/index";

export const busCompanyService = {
    getAllBusCompanies: async (): Promise<BusCompany[]> => {
        try {
            const response: BusCompany[] = await api.get('/bus_companies');
            return response || [];
        } catch (error) {
            console.error('Error fetching bus companies:', error);
            throw error;
        }
    },
    getBusCompanyById: async (id: string): Promise<BusCompany> => {
        try {
            const response = await api.get(`/bus_companies/${id}`);
            return response as unknown as BusCompany;
        } catch (error) {
            console.error('Error fetching bus company:', error);
            throw error;
        }
    },
    getPopularBusCompanies: async (limit: number = 5): Promise<BusCompany[]> => {
        try {
            const response = await api.get(`/bus_companies?_sort=rating&_order=desc&_limit=${limit}`);
            return response as unknown as BusCompany[];
        } catch (error) {
            console.error('Error fetching popular bus companies:', error);
            throw error;
        }
    },
    createBusCompany: async (data: Omit<BusCompany, 'bus_company_id' | 'id'>): Promise<BusCompany> => {
        try {
            const response = await api.post('/bus_companies', data);
            return response as unknown as BusCompany;
        } catch (error) {
            console.error('Error creating bus company:', error);
            throw error;
        }
    },
    updateBusCompany: async (id: string, data: Partial<BusCompany>): Promise<BusCompany> => {
        try {
            const response = await api.patch(`/bus_companies/${id}`, data);
            return response as unknown as BusCompany;
        } catch (error) {
            console.error('Error updating bus company:', error);
            throw error;
        }
    },
    deleteBusCompany: async (id: string): Promise<void> => {
        try {
            await api.delete(`/bus_companies/${id}`);
        } catch (error) {
            console.error('Error deleting bus company:', error);
            throw error;
        }
    }
}