import api from "../api/api";
import type { City, Station } from "../types/index";

export const stationService = {
  getAllStations: async (): Promise<Station[]> => {
    try {
      const response: any = await api.get("/stations");
      return Array.isArray(response) ? response : (response?.data ?? []);
    } catch (error) {
      console.error("Error fetching stations:", error);
      return [];
    }
  },
  getStationsByCity: async (city_id: number | string): Promise<Station[]> => {
    try {
      const response: any = await api.get(`/stations?city_id=${city_id}`);
      return Array.isArray(response) ? response : (response?.data ?? []);
    } catch (error) {
      console.error(`Error fetching stations for city ${city_id}:`, error);
      return [];
    }
  },
  getAllStationWithCity: async (): Promise<
    (Station & { city_name?: string })[]
  > => {
    try {
      const rawResponse: any = await api.get("/stations");
      const response: Station[] = Array.isArray(rawResponse)
        ? rawResponse
        : (rawResponse?.data ?? []);
      const rawCityResponse: any = await api.get("/cities");
      const responseCity: City[] = Array.isArray(rawCityResponse)
        ? rawCityResponse
        : (rawCityResponse?.data ?? []);

      const cityMapping: Record<string, string> = responseCity.reduce(
        (acc, city) => {
          return {
            ...acc,
            [city.id]: city.city_name,
          };
        },
        {},
      );

      const returnData: (Station & { city_name?: string })[] = response.map(
        (item) => {
          return { ...item, city_name: cityMapping[item.city_id] };
        },
      );

      return returnData;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  getPopularStations: async (limit: number = 5): Promise<Station[]> => {
    try {
      const response: any = await api.get(`/stations?limit=${limit}`);
      return Array.isArray(response) ? response : (response?.data ?? []);
    } catch (error) {
      console.error("Error fetching popular stations:", error);
      throw error;
    }
  },
  getParticularStation: async (id: string): Promise<Station | undefined> => {
    try {
      const response: Station = await api.get(`/stations/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  },
  createStation: async (station: Station) => {
    try {
      await api.post("/stations", station);
    } catch (error) {
      console.log(error);
    }
  },
  updataStation: async (station: Station) => {
    try {
      await api.put("/stations/" + station.id, station);
    } catch (error) {
      console.log(error);
    }
  },
  deleteStation: async (id: number | string) => {
    try {
      await api.delete("/stations/" + id);
    } catch (error) {
      console.log(error);
    }
  },
};
