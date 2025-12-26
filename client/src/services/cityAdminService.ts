import api from "../api/api";
import type { City } from "../types";

const cityAdminService = {
    getAllCityData: async () : Promise<City[] | undefined> => {
        try {
            const responseGetCities: City[] = await api.get('/cities')
            return responseGetCities ? responseGetCities : undefined
        } catch (error) {
            console.log(error);
        }
    },
    deleteCityData: async (city_id : number | string) => {
        try {
            const responsePostCity : City = await api.delete('/cities?city_id='+city_id)
            console.log(responsePostCity)
        } catch (error) {
            console.log(error)
        }
    },
    postCityData: async (city: City) => {
        try {
            const response = await api.post("/cities", city)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
}

export default cityAdminService