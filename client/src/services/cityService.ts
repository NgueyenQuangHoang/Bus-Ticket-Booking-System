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
  },
  deleteCity: async (id: number | string): Promise<void> => {
    try {
      await api.delete('/cities/'+id);

    } catch (error) {
      console.error(`Error deleting city with ID ${id}:`, error);
      throw error;
    }
  },
  updateCity: async (id: number | string, cityData: City): Promise<City> => {
    try {
      const response = await api.put<City>(`/cities/${id}`, cityData);
      return response as unknown as City;
    } catch (error) {
      console.error(`Error updating city with ID ${id}:`, error);
      throw error;
    }
  },
  createCity: async (cityData: City): Promise<City> => {
    try {
      const response = await api.post<City>('/cities', cityData);
      return response as unknown as City;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  }
};
