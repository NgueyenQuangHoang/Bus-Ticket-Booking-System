import BannerBusStationDetails from "./components/Banner";
import BusStationContent from "./components/BusStationContent";


export default function BusStationDetailPage() {
    return (
        <section className="bg-white">

            <BannerBusStationDetails />
            <BusStationContent />
        </section>
    );
}
