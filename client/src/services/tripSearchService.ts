import api from '../api/api';
import type { City } from '../types/index';

// Interfaces for API responses
interface Station {
  station_id: number;
  station_name: string;
  city_id: number;
  image?: string;
  description?: string;
  location?: string;
}

interface Route {
  route_id: number;
  departure_station_id: number;
  arrival_station_id: number;
  distance: number;
  duration: number;
  base_price: number;
}

interface Bus {
  bus_id: number;
  bus_company_id: number;
  name: string;
  license_plate: string;
  capacity: number;
  amenities: string;
}

interface BusCompany {
  bus_company_id: number;
  company_name: string;
  image?: string;
  description?: string;
  rating?: number;
}

interface Schedule {
  schedule_id: number;
  route_id: number;
  bus_id: number;
  departure_time: string;
  arrival_time: string;
  total_seats: number;
  available_seats: number;
  status: string;
}

// Kết quả tìm kiếm chuyến xe
export interface TripSearchResult {
  schedule_id: number;
  departure_time: string;
  arrival_time: string;
  duration: number; // minutes
  price: number;
  available_seats: number;
  total_seats: number;
  bus_name: string;
  bus_amenities: string;
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
   */
  searchTrips: async (params: SearchParams): Promise<TripSearchResult[]> => {
    try {
      // 1. Fetch tất cả dữ liệu cần thiết
      const [cities, stations, routes, schedules, buses, busCompanies] = await Promise.all([
        api.get<City[]>('/cities'),
        api.get<Station[]>('/stations'),
        api.get<Route[]>('/routes'),
        api.get<Schedule[]>('/schedules'),
        api.get<Bus[]>('/buses'),
        api.get<BusCompany[]>('/bus_companies'),
      ]);

      // Cast to arrays
      const citiesArr = cities as unknown as City[];
      const stationsArr = stations as unknown as Station[];
      const routesArr = routes as unknown as Route[];
      const schedulesArr = schedules as unknown as Schedule[];
      const busesArr = buses as unknown as Bus[];
      const companiesArr = busCompanies as unknown as BusCompany[];

      // 2. Tìm city_id từ tên thành phố
      const fromCityData = citiesArr.find(c => c.city_name === params.fromCity);
      const toCityData = citiesArr.find(c => c.city_name === params.toCity);

      if (!fromCityData || !toCityData) {
        console.log('Cities not found:', params.fromCity, params.toCity);
        return [];
      }

      // 3. Tìm các stations thuộc thành phố đi và đến
      const departureStations = stationsArr.filter(s => s.city_id === fromCityData.city_id);
      const arrivalStations = stationsArr.filter(s => s.city_id === toCityData.city_id);

      if (departureStations.length === 0 || arrivalStations.length === 0) {
        console.log('Stations not found for cities');
        return [];
      }

      const departureStationIds = departureStations.map(s => s.station_id);
      const arrivalStationIds = arrivalStations.map(s => s.station_id);

      // 4. Tìm các routes kết nối giữa 2 thành phố
      const matchingRoutes = routesArr.filter(r =>
        departureStationIds.includes(r.departure_station_id) &&
        arrivalStationIds.includes(r.arrival_station_id)
      );

      if (matchingRoutes.length === 0) {
        console.log('No routes found between cities');
        return [];
      }

      const routeIds = matchingRoutes.map(r => r.route_id);

      // 5. Tìm schedules theo routes và filter theo ngày nếu có
      let matchingSchedules = schedulesArr.filter(s =>
        routeIds.includes(s.route_id) && s.status === 'AVAILABLE'
      );

      // Filter theo ngày nếu có
      if (params.date) {
        matchingSchedules = matchingSchedules.filter(s => {
          const scheduleDate = s.departure_time.split('T')[0];
          return scheduleDate === params.date;
        });
      }

      // 6. Filter chuyến xe còn hiệu lực (ít nhất 1 tiếng trước giờ khởi hành)
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // Thêm 1 tiếng
      
      matchingSchedules = matchingSchedules.filter(s => {
        const departureTime = new Date(s.departure_time);
        // Chỉ hiển thị chuyến có giờ khởi hành >= (hiện tại + 1 tiếng)
        return departureTime >= oneHourFromNow;
      });

      // 6. Build kết quả
      const results: TripSearchResult[] = matchingSchedules.map(schedule => {
        const route = matchingRoutes.find(r => r.route_id === schedule.route_id)!;
        const bus = busesArr.find(b => b.bus_id === schedule.bus_id);
        const company = bus ? companiesArr.find(c => c.bus_company_id === bus.bus_company_id) : null;
        const depStation = stationsArr.find(s => s.station_id === route.departure_station_id);
        const arrStation = stationsArr.find(s => s.station_id === route.arrival_station_id);

        return {
          schedule_id: schedule.schedule_id,
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time,
          duration: route.duration,
          price: route.base_price,
          available_seats: schedule.available_seats,
          total_seats: schedule.total_seats,
          bus_name: bus?.name || 'Không xác định',
          bus_amenities: bus?.amenities || '',
          company_name: company?.company_name || 'Không xác định',
          company_image: company?.image,
          company_rating: company?.rating,
          departure_station: depStation?.station_name || '',
          arrival_station: arrStation?.station_name || '',
          departure_city: params.fromCity,
          arrival_city: params.toCity,
        };
      });

      // Sắp xếp theo giờ khởi hành
      results.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());

      return results;
    } catch (error) {
      console.error('Error searching trips:', error);
      throw error;
    }
  },
};
