import api from '../api/api';
import type { City } from '../types/index';

export const cityService = {
  getAllCities: async (): Promise<City[]> => {
    try {
      const response = await api.get<any>('/cities');
      // Extract data if response is a paginated object
      return response.data ? response.data : response;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },
  deleteCity: async (id: string): Promise<void> => {
    try {
      await api.delete('/cities/'+id);
    } catch (error) {
      console.error(`Error deleting city with ID ${id}:`, error);
      throw error;
    }
  },
  updateCity: async (cityData: City): Promise<City> => {
    try {
      const response = await api.put<City>(`/cities/${cityData.id}`, cityData);
      return response as unknown as City;
    } catch (error) {
      console.error(`Error updating city with ID ${cityData.id}:`, error);
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
  },
  getParticularCity: async (city_id: string): Promise<City | undefined> => {
    try {
      const response : City= await api.get('/cities/'+city_id)
      return response
    } catch (error) {
      console.log(error);
      return undefined
    }
  }
};
