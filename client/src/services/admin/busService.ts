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

  getAllBusLayouts: async (): Promise<any[]> => {
    try {
      const response = await api.get('/bus_layouts');
      return response as unknown as any[];
    } catch (error) {
      console.error('Error fetching bus layouts:', error);
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
  ,

  createBus: async (data: Omit<Bus, 'bus_id' | 'id'>): Promise<Bus> => {
    try {
      const response = await api.post('/buses', data);
      return response as unknown as Bus;
    } catch (error) {
      console.error('Error creating bus:', error);
      throw error;
    }
  },

  updateBus: async (id: string, data: Partial<Bus>): Promise<Bus> => {
    try {
      const response = await api.patch(`/buses/${id}`, data);
      return response as unknown as Bus;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  deleteBus: async (id: string): Promise<void> => {
    try {
      await api.delete(`/buses/${id}`);
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }
};

export default busService;
