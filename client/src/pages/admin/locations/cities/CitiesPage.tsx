import { useEffect, useState } from 'react'
import type { City } from '../../../../types'
import CityTable from './components/CityTable'
import CityFormModal from './components/CityFormModal'
import { Pagination, Paper } from '@mui/material'
import CitySearch from './components/CitySearch'
import { useAppDispatch, useAppSelector } from '../../../../hooks'
import { addNewCity, deleteCity, fetchCities, updateCity } from '../../../../slices/citySlice'
import { removeRoute } from '../../../../slices/routesSlice'
import { removeStation } from '../../../../slices/stationSlice'

export default function CitiesPage() {
    const itemsPerPage = 10
    const {cities} = useAppSelector(state => state.city)
    const {routes} = useAppSelector(state=>state.routes)
    const {stations} = useAppSelector(state=>state.station)
    const dispatch = useAppDispatch()
    const [searchCity, setSearchCity] = useState<string>('')
    useEffect(() => {
        dispatch(fetchCities())
    }, [dispatch])
    
    const [currentPage, setCurrentPage] = useState<number>(1)
    const handleChangePage = (event: React.ChangeEvent<unknown>,value: number) => {
        console.log(event);
        setCurrentPage(value);
    }

    const handleDelete = ((city: City) => {
        stations.forEach(station => {
            if (station.city_id === city.id){
                routes.forEach(route => {
                    if(route.arrival_station_id === station.id || route.departure_station_id == station.id){
                        dispatch(removeRoute(route.id))
                    }
                })
                dispatch(removeStation(station.id))
            }
        })
        dispatch(deleteCity(city.id))
    })

    const updateCities = ((city: City) => {
        if (cities){
            dispatch(updateCity(city))
        }
    })

    const addNewCities = ((city: City) => {
        if (cities){
            dispatch(addNewCity(city))
        }
    })    

    const cityRender = cities
        .filter((city) => {
            return !searchCity || city.city_name.toLowerCase().includes(searchCity.toLowerCase())
        })
        .slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage)

    return (
        <div className='py-5'>
            <CityFormModal numberCities={cities ? cities.length : 0} onAdd={addNewCities}/>
            <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <CitySearch onChangeInputData={setSearchCity} inputData={searchCity} totalCities={cities? cities.length : 0}/>
            {cityRender && <CityTable cities={
                cityRender
                }
                onDelete={handleDelete}
                    onUpdateCities={updateCities}
                />}
            </Paper>
            <div className='mt-3 flex items-center justify-center'>
                {cities && <Pagination count={
                    !searchCity ? Math.ceil(cities.length / itemsPerPage) :
                    Math.ceil(cityRender.length / itemsPerPage )}
                    onChange={handleChangePage}/>}
            </div>
        </div>
    )
}
