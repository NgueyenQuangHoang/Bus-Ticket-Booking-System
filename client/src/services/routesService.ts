import api from "../api/api";
import type { routesInfomation } from "../pages/user/routes/RoutesPage";
import type { Station } from "../types";
import type { Route } from "../types/route"



export const routesService = {
    getAllRoutes: async (): Promise<Route[]> => {
        try {
            const response: any = await api.get('/routes', { params: { limit: 10000 } });
            return Array.isArray(response) ? response : (response?.data ?? []);
        } catch (error) {
            console.error('Error fetching all routes:', error);
            throw error;
        }
    },
    getRoutesByStations: async (dep_id: number | string, arr_id: number | string): Promise<Route[]> => {
        try {
            const response: any = await api.get(`/routes?departure_station_id=${dep_id}&arrival_station_id=${arr_id}`);
            return Array.isArray(response) ? response : (response?.data ?? []);
        } catch (error) {
            console.error('Error fetching routes by stations:', error);
            return [];
        }
    },
    getInformationRoutes: async (): Promise<routesInfomation[] | undefined> => {
        try {
            const rawRoutes: any = await api.get('/routes', { params: { limit: 10000 } });
            const responseGetRoutes: Route[] = Array.isArray(rawRoutes) ? rawRoutes : (rawRoutes?.data ?? []);
            const rawStations: any = await api.get('/stations', { params: { limit: 10000 } });
            const responseGetStations: Station[] = Array.isArray(rawStations) ? rawStations : (rawStations?.data ?? [])
            const stationMap = responseGetStations.reduce((acc, curr) => {
                acc[String(curr.id)] = curr.station_name;
                return acc;
            }, {} as Record<string, string>);
            console.log(stationMap);

            const dataReturn: routesInfomation[] = responseGetRoutes.map((item) => {
                const departure_name = stationMap[item.departure_station_id]
                const arrival_name = stationMap[item.arrival_station_id]
                return {
                    route_id: item.id,
                    departure_station_name: departure_name ? departure_name : '',
                    arrival_station_name: arrival_name ? arrival_name : '',
                    description: item.description,
                    departure_station_id: item.departure_station_id,
                    arrival_station_id: item.arrival_station_id
                }
            })

            return responseGetRoutes ? dataReturn : undefined
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    },
    getPopularRoutes: async (limit: number = 5): Promise<Route[]> => {
        try {
            const response: any = await api.get('/routes', { params: { sort: 'total_bookings', order: 'desc', limit } });
            return Array.isArray(response) ? response : (response?.data ?? []);
        } catch (error) {
            console.error('Error fetching popular routes:', error);
            throw error;
        }
    },
    deleteRoute: async (route_id: string): Promise<string> => {
        try {
            await api.delete('/routes/' + route_id)
            return route_id
        } catch (error) {
            console.log(error);
            return '0'
        }
    },
    updateRoute: async (route: Route): Promise<Route | undefined> => {
        try {
            await api.put('/routes/' + route.id, route)
            return route
        } catch (error) {
            console.log(error);
        }
    },
    createRoute: async (route: Route): Promise<Route> => {
        try {
            await api.post('/routes', route)
            return route
        } catch (error) {
            console.log(error);
            return error as Route
        }
    },
    getParticularRoute: async (id: string): Promise<Route> => {
        const response : Route= await api.get('/routes/'+id)
        return response
    }
}