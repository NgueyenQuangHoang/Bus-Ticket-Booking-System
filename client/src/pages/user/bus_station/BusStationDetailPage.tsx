import BannerBusStationDetails from "../../../components/bus_station/busstationdetail/Banner";
import BusStationContent from "../../../components/bus_station/busstationdetail/BusStationContent";


export default function BusStationDetailPage() {
    return (
        <section className="bg-white">

           <BannerBusStationDetails />
        <BusStationContent />
        </section>
    );
}
