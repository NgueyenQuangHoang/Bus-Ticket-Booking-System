import api from "../api/api";
import type { routesInfomation } from "../pages/user/route/RoutesPage";
import type { Station } from "../types";
import type { Route } from "../types/route"



export const routesService = {
    getInformationRoutes: async (): Promise<routesInfomation[] | undefined> => {
        try {
            const responseGetRoutes: Route[] = await api.get('/routes');
            const responseGetStations: Station[] = await api.get('/stations')

            const stationMap = responseGetStations.reduce((acc, curr) => {
                acc[curr.station_id] = curr.station_name;
                return acc;
            }, {} as Record<number, string>);
            console.log(stationMap);
            
            const dataReturn : routesInfomation[] = responseGetRoutes.map((item) => {
                const departure_name= stationMap[item.departure_station_id]
                const arrival_name= stationMap[item.arrival_station_id]
                return {
                    route_id: item.route_id,
                    departure_station_name: departure_name ? departure_name : '',
                    arrival_station_name: arrival_name ? arrival_name : '',
                    description: item.description
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
            const response = await api.get(`/routes?_sort=total_bookings&_order=desc&_limit=${limit}`);
            return response as unknown as Route[];
        } catch (error) {
            console.error('Error fetching popular routes:', error);
            throw error;
        }
    }
}