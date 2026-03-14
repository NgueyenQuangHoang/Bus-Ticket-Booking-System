import api from '../api/api';

// Kết quả tìm kiếm chuyến xe
export interface TripSearchResult {
  schedule_id: string;
  bus_id: string;
  departure_time: string;
  arrival_time: string;
  duration: number; // minutes
  price: number;
  available_seats: number;
  total_seats: number;
  bus_name: string;
  bus_amenities: string;
  layout_id?: string;
  company_name: string;
  company_image?: string;
  company_rating?: number;
  departure_station: string;
  arrival_station: string;
  departure_city: string;
  arrival_city: string;
}

export interface SearchParams {
  fromCity: string;
  toCity: string;
  date?: string;
}

export const tripSearchService = {
  /**
   * Tìm kiếm chuyến xe theo thành phố đi và đến
   * Backend handles all JOINs and filtering server-side
   */
  searchTrips: async (params: SearchParams): Promise<TripSearchResult[]> => {
    try {
      let url = `/trips/search?fromCity=${encodeURIComponent(params.fromCity)}&toCity=${encodeURIComponent(params.toCity)}`;

      if (params.date) {
        url += `&date=${encodeURIComponent(params.date)}`;
      }

      const results: TripSearchResult[] = await api.get(url);

      // Results come pre-sorted from backend, but ensure client-side sort as fallback
      if (Array.isArray(results)) {
        results.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
        return results;
      }

      return [];
    } catch (error) {
      console.error('Error searching trips:', error);
      throw error;
    }
  },
};
