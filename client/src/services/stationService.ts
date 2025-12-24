import api from '../api/api';
import type { Station } from '../types/index';

export const stationService = {
  getAllStations: async (): Promise<Station[] | undefined> => {
    try {
      const response : Station[] = await api.get('/stations');
      if(response){
        return response
      }
      return undefined
    } catch (error) {
      console.error('Error fetching stations:', error);
      return undefined
      throw error;
    }
  },
  getPopularStations: async (limit: number = 5): Promise<Station[]> => {
    try {
        // For now, just fetching stations. In real app, might sort by bookings or rating.
        const response = await api.get(`/stations?_limit=${limit}`);
        return response as unknown as Station[];
    } catch (error) {
        console.error('Error fetching popular stations:', error);
        throw error;
    }
  },
  getParticularStation: async (station_id: number) : Promise<Station | undefined> => {
    try {
      const response : Station[] = await api.get(`/stations?station_id=${station_id}`)
      return response ? response[0] : undefined
    } catch (error) {
      console.log(error);
      return undefined
    }
  }
  
};
