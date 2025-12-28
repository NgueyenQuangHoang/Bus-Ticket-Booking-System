import api from '../../api/api';
import type { Bus } from '../../types/bus';

const busService = {
  getAllBuses: async (): Promise<Bus[]> => {
    try {
      const response = await api.get('/buses');
      return response as unknown as Bus[];
    } catch (error) {
      console.error('Error fetching buses:', error);
      return [];
    }
  },

  getBusById: async (id: number | string): Promise<Bus | null> => {
    try {
        const response = await api.get(`/buses/${id}`);
        return response as unknown as Bus;
    } catch (error) {
        console.error(`Error fetching bus ${id}:`, error);
        return null;
    }
  },
  
  updateBusLayout: async (busId: number | string, layoutId: number | string): Promise<Bus | null> => {
      try {
          const response = await api.patch(`/buses/${busId}`, { layout_id: layoutId });
          return response as unknown as Bus;
      } catch (error) {
          console.error('Error linking layout to bus:', error);
          return null;
      }
  }
};

export default busService;
