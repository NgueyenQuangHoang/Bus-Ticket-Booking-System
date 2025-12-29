import api from "../api/api";
import type { routesInfomation } from "../pages/user/routes/RoutesPage";
import type { Station } from "../types";
import type { Route } from "../types/route"



export const routesService = {
    getAllRoutes: async (): Promise<Route[]> => {
        try {
            const response = await api.get<Route[]>('/routes');
            return response as unknown as Route[];
        } catch (error) {
            console.error('Error fetching all routes:', error);
            throw error;
        }
    },
    getInformationRoutes: async (): Promise<routesInfomation[] | undefined> => {
        try {
            const responseGetRoutes: Route[] = await api.get('/routes');
            const responseGetStations: Station[] = await api.get('/stations')
            const stationMap = responseGetStations.reduce((acc, curr) => {
                acc[String(curr.id)] = curr.station_name;
                return acc;
            }, {} as Record<string, string>);
            console.log(stationMap);

            const dataReturn: routesInfomation[] = responseGetRoutes.map((item) => {
                const departure_name = stationMap[item.departure_station_id]
                const arrival_name = stationMap[item.arrival_station_id]
                return [{
                    route_id: item.id,
                    departure_station_name: departure_name ? departure_name : '',
                    arrival_station_name: arrival_name ? arrival_name : '',
                    description: item.description
                }]
            })

            return responseGetRoutes ? dataReturn : undefined
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    },
    getPopularRoutes: async (limit: number = 5): Promise<Route[]> => {
        try {
            const response = await api.get(`/routes?_sort=total_bookings&_order=desc&_limit=${limit}`);
            return response as unknown as Route[];
        } catch (error) {
            console.error('Error fetching popular routes:', error);
            throw error;
        }
    },
    deleteRoute: async (route_id: string): Promise<string> => {
        try {
            await api.delete('/routes/'+route_id)
            return route_id
        } catch (error) {
            console.log(error);
            return '0'
        }
    },
    updateRoute: async (route:Route): Promise<Route | undefined> => {
        try {
            await api.put('/routes/'+route.id, route)
            return route
        } catch (error) {
            console.log(error);
        }   
    },
    createRoute: async (route: Route) : Promise<Route> => {
        try {
            await api.post('/routes', route)
            return route
        } catch (error) {
            console.log(error);
            return error as Route
        }
    }
}