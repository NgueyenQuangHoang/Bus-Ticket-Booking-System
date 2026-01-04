import { Pagination, Paper } from "@mui/material";
import RouteFormModal from "./components/RouteFormModal";
import RouteSearch from "./components/RouteSearch";
import RouteTable from "./components/RouteTable";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { useEffect, useState } from "react";
import { fetchRoutes } from "../../../../slices/routesSlice";
import { fetchStations } from "../../../../slices/stationSlice";


export default function RouteAdminPage() {
    const {stations} = useAppSelector(state => state.station)
    const {routes} = useAppSelector((state) => state.routes)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchRoutes())
        dispatch(fetchStations())
    }, [dispatch])
    const stationMap: Record<string, string> = Object.fromEntries(
        stations.map((s) => [s.id, s.station_name])
    );
    const [inputData, setInputData] = useState<string>('')
    const [currentPage, setCurrentPage] = useState(1)

    const handleSetPage = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page)
    }

    const routesRender = routes && stationMap && routes.filter(item => 
        stationMap[item.departure_station_id] && stationMap[item.arrival_station_id] && 
        (stationMap[item.departure_station_id].toLowerCase().includes(inputData.toLowerCase()) || 
        stationMap[item.arrival_station_id].toLowerCase().includes(inputData.toLowerCase())
    )).slice((currentPage-1)*10, currentPage*10)
    return (
        <div className='py-5'>
            <div className='py-5'>
                        <RouteFormModal stationMapping={stationMap} length={routes.length}/>
                        <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
                        <RouteSearch onChangeInput={setInputData} 
                        length={routes.length}
                        />
                            <RouteTable stationMapping={
                                stationMap
                                } routes={
                                    routesRender
                                    }
                                    />
                        </Paper>
                        <div className="py-4 flex justify-center"><Pagination 
                    onChange={handleSetPage}
                        count={Math.ceil(routes.length/10)}/></div>
                    </div>
        </div>
    )
}
