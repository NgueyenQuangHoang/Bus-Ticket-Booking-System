import { useState } from 'react'
import CardBusStation from '../../../components/bus_station/busstationpage/CardBusStation';
import PaginationStation from '../../../components/bus_station/busstationpage/PaginationStation';
import { stationService } from '../../../services/stationService';
import type { Station } from '../../../types';


export default function BusStationPage() {
    const responseGetAllStation = stationService.getAllStations()
    const [dataStations, setDataStation] = useState<Station[]>([])
    const itemPerPage = 8
    const totalPage = Math.ceil(dataStations.length / itemPerPage)
    const [currentPage, setCurrentPage] = useState(1)
    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1)
        }
    }
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    const clickPage = (page: number) => {
        setCurrentPage(page)
    }
    responseGetAllStation.then((data) => {
        if (data) {
            setDataStation(data)
        }
    })

    return (

        <section

            className=" max-w-7xl mx-auto py-8 px-3 [@media(min-width:391px)]:px-4 [@media(min-width:769px)]:px-0">
            {/* Title */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <span className="w-1 h-12 bg-yellow-400"></span>
                <h2
                    className="font-bold text-2xl  min-[391px]:text-4xl"
                >
                    Bến Xe
                </h2>
            </div>

            {dataStations ? <CardBusStation stations={dataStations} itemPerPage={itemPerPage} currentPage={currentPage}/> : <></>}
            <PaginationStation 
            clickPage={clickPage} 
            currentPage={currentPage}
            nextPage={nextPage}
            prevPage={prevPage}
            totalPage={totalPage}
            />

            <p
                className="
    text-left text-gray-500 mt-4
    text-xs min-[391px]:text-sm"
            >
                Tập hợp các bến xe và thông tin chi tiết lịch trình, giờ khởi hành của các nhà xe có tại bến.
            </p>

        </section>
    );
};
