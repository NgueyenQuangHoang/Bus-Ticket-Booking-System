import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import BannerRoute from "./components/BannerRoute";
import ContentRouteDetail from "./components/ContentRouteDetail";
import { fetchStations } from "../../../../slices/stationSlice";
import { fetchCities } from "../../../../slices/citySlice";
import { useParams } from "react-router-dom";
import type { Route } from "../../../../types";
import { routesService } from "../../../../services/routesService";

export default function RouteDetailPage() {
    const {id} = useParams()
    const [route, setRoute] = useState<Route>()
    const { cities } = useAppSelector(state => state.city)
    const { stations } = useAppSelector(state => state.station)
    const dispatch = useAppDispatch()
    useEffect(() => {
        routesService.getParticularRoute(id as string).then((res) => {
            setRoute(res)
        })
        dispatch(fetchStations())
        dispatch(fetchCities())
    }, [dispatch, id])
    const departureStation = stations.find(item => item.id === route?.departure_station_id)
    const arrivalStation = stations.find(item => item.id === route?.arrival_station_id)
    const departTureCity = cities.find(item => item.id === departureStation?.city_id)
    const arrivalCity = cities.find(item => item.id === arrivalStation?.city_id)

    console.log('de: ', departureStation, departTureCity);
    console.log('ar: ', arrivalStation, arrivalCity);
    
    return (
        <section className="bg-white">

            <BannerRoute departureCity={departTureCity} arrivalCity={arrivalCity}/>
            <ContentRouteDetail route={route} arrivalStation={arrivalStation} departureStation={departureStation}/>
        </section>
    );
}
