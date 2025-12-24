import api from '../api/api';
import type { PopularRoute } from '../types/index';

export const popularRouteService = {
  getPopularRoutes: async (): Promise<PopularRoute[]> => {
    try {
        // Fetch popular_routes, sorting by priority if needed
      const response = await api.get<PopularRoute[]>('/popular_routes?_sort=priority&_order=asc');
      return response as unknown as PopularRoute[];
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      throw error;
    }
  }
};
