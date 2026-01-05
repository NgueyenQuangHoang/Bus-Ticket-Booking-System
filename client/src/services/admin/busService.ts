import api from '../../api/api';
import type { Bus } from '../../types/bus';
import type { Seat } from '../../types/seat';

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

  getBusesByCompanyId: async (companyId: string): Promise<Bus[]> => {
    try {
      const response = await api.get(`/buses?bus_company_id=${companyId}`);
      return response as unknown as Bus[];
    } catch (error) {
      console.error(`Error fetching buses for company ${companyId}:`, error);
      return [];
    }
  },

  getAllBusLayouts: async (): Promise<import('../../types/bus').BusLayout[]> => {
    try {
      const response = await api.get('/bus_layouts');
      return response as unknown as import('../../types/bus').BusLayout[];
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
  },

  getBusSeatStats: async (busId: string): Promise<{ total: number; available: number }> => {
    try {
      // Query physical seats for this bus
      const response = await api.get(`/seats?bus_id=${busId}`);
      const seats = response as unknown as Seat[];
      
      const total = seats.length;
      const available = seats.filter(s => s.is_available_for_booking).length;
      
      return { total, available };
    } catch (error) {
      console.error(`Error fetching seat stats for bus ${busId}:`, error);
      return { total: 0, available: 0 };
    }
  }
};

export default busService;
