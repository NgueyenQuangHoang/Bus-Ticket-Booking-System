import api from '../api/api';
import type { City } from '../types/index';

export const cityService = {
  getAllCities: async (): Promise<City[]> => {
    try {
      const response = await api.get<City[]>('/cities');
      return response as unknown as City[];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }
};
