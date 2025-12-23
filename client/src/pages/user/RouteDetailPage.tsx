
import BannerBusCompany from "../../components/buscompanydetail/BannerBusCompany";
import ContentBusCompany from "../../components/buscompanydetail/ContentBusCompany";
import BannerRoute from "../../components/routedetail/BannerRoute";
import ContentRouteDetail from "../../components/routedetail/ContentRouteDetail";

export default function RouteDetailPage() {
    return (
        <section className="bg-white">

           <BannerRoute />
           <ContentRouteDetail />
        </section>
    );
}
