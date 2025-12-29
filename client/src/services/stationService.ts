import api from '../api/api';
import type { City, Station } from '../types/index';

export const stationService = {
    getAllStations: async (): Promise<Station[]> => {
        try {
            const response: Station[] = await api.get('/stations');
            return response ?? [];
        } catch (error) {
            console.error('Error fetching stations:', error);
            return [];
        }
    },
    getAllStationWithCity: async () : Promise<(Station&{city_name?:string})[]> => {
        try {
            const response : Station[] = await api.get('/stations')
            const responseCity: City[] = await api.get('/cities')

            const cityMapping: Record<string, string> = responseCity.reduce((acc, city) => {
                return {
                    ...acc,
                    [city.id]: city.city_name
                };
            }, {});

            const returnData: (Station & { city_name?: string })[] = response.map((item) => {
                return {...item, city_name: cityMapping[item.city_id]}
            })
            
            return returnData
        } catch (error) {
            console.log(error);
            return []
        }
    }
    
    ,

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
    getParticularStation: async (station_id: number): Promise<Station | undefined> => {
        try {
            const response: Station[] = await api.get(`/stations?station_id=${station_id}`)
            return response ? response[0] : undefined
        } catch (error) {
            console.log(error);
            return undefined
        }
    },
    createStation: async (station: Station) => {
        try {
            await api.post('/stations', station)
        } catch (error) {
            console.log(error);
        }
    },
    updataStation: async (station: Station) => {
        try {
            await api.put('/stations/' + station.id, station)
        } catch (error) {
            console.log(error);
        }
    },
    deleteStation: async (id: number | string) => {
        try {
            await api.delete('/stations/' + id)
        } catch (error) {
            console.log(error);
        }
    }
};
