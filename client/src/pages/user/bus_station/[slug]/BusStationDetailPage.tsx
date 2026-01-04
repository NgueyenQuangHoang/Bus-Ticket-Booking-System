import { useParams } from "react-router-dom";
import BannerBusStationDetails from "./components/Banner";
import BusStationContent from "./components/BusStationContent";
import { useEffect, useState } from "react";
import type { Station } from "../../../../types";
import { stationService } from "../../../../services/stationService";


export default function BusStationDetailPage() {
    const {id} = useParams()
    const [station, setStation] = useState<Station>()
    useEffect(() => {
        stationService.getParticularStation(id as string).then((res) => {
            setStation(res)
        }) 
    }, [id])
    return (
        <section className="bg-white">

            <BannerBusStationDetails station={station}/>
            <BusStationContent station={station}/>
        </section>
    );
}
