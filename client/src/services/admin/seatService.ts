import api from '../../api/api';
import type { SeatType, BusLayout, SeatPosition } from '../../types/seat';

const seatService = {
  // --- Seat Types ---
  getAllSeatTypes: async (): Promise<SeatType[]> => {
    try {
      const response = await api.get('/seat_types');
      return response as unknown as SeatType[];
    } catch (error) {
      console.error('Error fetching seat types:', error);
      return [];
    }
  },

  createSeatType: async (data: Partial<SeatType>): Promise<SeatType | null> => {
    try {
      const response = await api.post('/seat_types', data);
      return response as unknown as SeatType;
    } catch (error) {
      console.error('Error creating seat type:', error);
      return null;
    }
  },

  updateSeatType: async (id: string | number, data: Partial<SeatType>): Promise<SeatType | null> => {
    try {
      const response = await api.put(`/seat_types/${id}`, data);
      return response as unknown as SeatType;
    } catch (error) {
      console.error('Error updating seat type:', error);
      return null;
    }
  },

  deleteSeatType: async (id: string | number): Promise<boolean> => {
    try {
      await api.delete(`/seat_types/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting seat type:', error);
      return false;
    }
  },

  // --- Bus Layouts ---
  getAllLayouts: async (): Promise<BusLayout[]> => {
     try {
      const response = await api.get('/bus_layouts');
      return response as unknown as BusLayout[];
    } catch (error) {
      console.error('Error fetching layouts:', error);
      return [];
    }
  },

  createLayout: async (layoutData: Partial<BusLayout>, positions: Partial<SeatPosition>[]): Promise<BusLayout | null> => {
    try {
      // 1. Create Layout
      const layoutResponse = await api.post('/bus_layouts', layoutData) as unknown as BusLayout;
      
      if (layoutResponse && layoutResponse.id) {
        // 2. Create Positions linked to Layout
        // Note: Ideally backend handles this transaction. 
        // With JSON-Server, we have to make multiple calls or custom route. 
        // For now, we loop (not efficient but standard for json-server without custom middleware)
        const positionPromises = positions.map(pos => 
            api.post('/seat_positions', { ...pos, layout_id: layoutResponse.id })
        );
        await Promise.all(positionPromises);
        return layoutResponse;
      }
      return null;
    } catch (error) {
        console.error('Error creating layout:', error);
        return null;
    }
  },

  getLayoutDetails: async (layoutId: string | number): Promise<{ layout: BusLayout, positions: SeatPosition[] } | null> => {
      try {
          const layout = await api.get(`/bus_layouts/${layoutId}`) as unknown as BusLayout;
          const positions = await api.get(`/seat_positions?layout_id=${layoutId}`) as unknown as SeatPosition[];
          return { layout, positions };
      } catch (error) {
          console.error('Error fetching layout details:', error);
          return null;
      }
  },

  updateLayoutPositions: async (layoutId: string | number, positions: SeatPosition[]): Promise<boolean> => {
    try {
      // 1. Get existing positions for this layout
      const existingPositions = await api.get(`/seat_positions?layout_id=${layoutId}`) as unknown as SeatPosition[];
      
      // 2. Delete all existing positions
      const deletePromises = existingPositions
        .map(pos => pos.id ?? pos.position_id)
        .filter((id): id is string | number => id !== undefined && id !== null)
        .map(id => api.delete(`/seat_positions/${id}`));
      await Promise.all(deletePromises);
      
      // 3. Create new positions
      const createPromises = positions.map(pos => 
        api.post('/seat_positions', { ...pos, layout_id: layoutId })
      );
      await Promise.all(createPromises);
      
      return true;
    } catch (error) {
      console.error('Error updating layout positions:', error);
      return false;
    }
  },
  
  // --- Seat Templates (Now part of bus_layouts) ---
  getAllTemplates: async (): Promise<BusLayout[]> => {
    try {
      const response = await api.get('/bus_layouts?is_template=true');
      return response as unknown as BusLayout[];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  },

  createTemplate: async (data: Partial<BusLayout>): Promise<BusLayout | null> => {
    try {
       const templateData = { ...data, is_template: true };
       const response = await api.post('/bus_layouts', templateData);
       // Note: Templates stored in bus_layouts don't necessarily need positions created immediately
       // unless we want to "pre-fill" them. For now, just creating the layout record.
      return response as unknown as BusLayout;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  },

  deleteTemplate: async (id: string | number): Promise<boolean> => {
    try {
      await api.delete(`/bus_layouts/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }
};

export default seatService;
