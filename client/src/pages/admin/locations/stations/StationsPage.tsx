import { Pagination, Paper } from "@mui/material";
import StationSearch from "./components/StationSearch";
import StationTable from "./components/StationTable";
import StationFormModal from "./components/StationFormModal";
import { useEffect, useState, type ChangeEvent } from "react";
import type { Station } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { addStation, fetchStations, removeStation, updateStation } from "../../../../slices/stationSlice";
import { removeRoute } from "../../../../slices/routesSlice";
import { busImageService } from "../../../../services/admin/busImageService";
import { fetchCities } from "../../../../slices/citySlice";

export type StationsCity = (Station & { city_name?: string })

export default function StationAdminPage() {
    const {stations} = useAppSelector(state => state.station)
    const {routes} = useAppSelector(state => state.routes)
    const dispatch = useAppDispatch()
    // const [stations, setStations] = useState<StationsCity[]>([])
    const itemPerPage = 10
    const [inputData, setInputData] = useState('')
    const [currentPage, setCurrentPage] = useState(1)


    const handleChangePage = (_event: ChangeEvent<unknown> ,page : number) => {
        setCurrentPage(page)
    }

    const handleDelete = (station: Station) => {
        dispatch(removeStation(station.id))
        routes.forEach(item => {
            if (item.arrival_station_id == station.id || item.departure_station_id === station.id) {
                dispatch(removeRoute(item.id))
            }
        })
    }

    const handleEdit = (station: Station) => {
        dispatch(updateStation(station))
    }

    const handleAdd = async (station: Station, file?: File) => {
        if (file) {
            try {
                const url = await busImageService.uploadFileToCloudinary(file);
                station.image = url;
                station.wallpaper = url; // Use same image for both per requirement
            } catch (error) {
                console.error("Upload failed", error);
            }
        }
        dispatch(addStation(station))
    }

    useEffect(() => { 
        // stationService.getAllStationWithCity().then((res) => {
        //     setStations(res)
        // })
        dispatch(fetchStations())
        dispatch(fetchCities())
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
