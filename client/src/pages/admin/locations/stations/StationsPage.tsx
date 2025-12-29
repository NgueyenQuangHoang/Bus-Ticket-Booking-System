import { Pagination, Paper } from "@mui/material";
import StationSearch from "./components/StationSearch";
import StationTable from "./components/StationTable";
import StationFormModal from "./components/StationFormModal";
import { useEffect, useState, type ChangeEvent } from "react";
import type { Station } from "../../../../types";
import { stationService } from "../../../../services/stationService";

export type StationsCity = (Station & { city_name?: string })

export default function StationAdminPage() {
    const [stations, setStations] = useState<StationsCity[]>([])
    const itemPerPage = 10
    const [inputData, setInputData] = useState('')
    const [currentPage, setCurrentPage] = useState(1)


    const handleChangePage = (_event: ChangeEvent<unknown> ,page : number) => {
        setCurrentPage(page)
    }

    const handleDelete = (id : string) => {
        setStations(prev => {
            return prev.filter(item => item.id != id)
        })
        stationService.deleteStation(id)
    }

    const handleEdit = (station: Station) => {
        setStations((prev) => {
            return prev.map(item => {
                if (item.id == station.id){
                    return station
                }
                return item
            })
        })
        stationService.updataStation(station)
    }

    const handleAdd = (station: Station) => {
        console.log(station);
        stationService.createStation(station)
        setStations(prev => [...prev, station])
    }

    useEffect(() => { 
        stationService.getAllStationWithCity().then((res) => {
            setStations(res)
        })
    }, [])

    const stationsRender = stations.filter((item) => {
        return item.station_name.toLowerCase().includes(inputData.toLowerCase())
    }).slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
    return (
        <div className='py-5'>
            <div className='py-5'>
                <StationFormModal onAdd={handleAdd}/>
                <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <StationSearch inputData={inputData} setInputData={setInputData}/>
                    <StationTable stations={stationsRender} onDelete={handleDelete} onEdit={handleEdit} />
                </Paper>
                <div className="py-4 flex justify-center"><Pagination 
                onChange={handleChangePage}
                count={(Math.ceil(stations.length / itemPerPage))} /></div>
            </div>
        </div>
    )
}
