
import { useParams } from "react-router-dom";
import BannerBusCompany from "./components/BannerBusCompany";
import ContentBusCompany from "./components/ContentBusCompany";
import { busCompanyService } from "../../../../services/busCompanyService";
import { useEffect, useState } from "react";
import type { BusCompany } from "../../../../types";

export default function BusCompanyDetailPage() {
    const {id} = useParams()
    const [busCompany, setBusCompany] = useState<BusCompany>()
    useEffect(() => {
        if(id){
            busCompanyService.getBusCompanyById(id).then((res) => {
                setBusCompany(res)
            })
        }
    }, [])
    
    return (
        <section className="bg-white">


            <BannerBusCompany busCompany={busCompany} />
            <ContentBusCompany busCompany={busCompany} />
        </section>
    );
}

