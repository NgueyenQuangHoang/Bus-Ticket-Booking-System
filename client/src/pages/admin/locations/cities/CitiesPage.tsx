import { useEffect, useState } from 'react'
import type { City } from '../../../../types'
import cityAdminService from '../../../../services/cityAdminService'
import CityTable from './components/CityTable'
import CityFormModal from './components/CityFormModal'
import { Pagination, Paper } from '@mui/material'
import CitySearch from './components/CitySearch'

export default function CitiesPage() {
    const [cities, setCities] = useState<City[] | null>(null)
    useEffect(() => {
        cityAdminService.getAllCityData().then((data) => {
            setCities(data || null)
        })
    }, [])
    const [searchCity, setSearchCity] = useState<string>('')
    const itemsPerPage = 10
    const [currentPage, setCurrentPage] = useState<number>(1)
    const handleChangePage = (event: React.ChangeEvent<unknown>,value: number) => {
        console.log(event);
        setCurrentPage(value);
    }

    const updateCitiesOnDelete = ((id: string | number) => {
        if (cities) {
            const updatedCities = cities.filter((city) => city.id !== id)
            setCities(updatedCities)
        }
    })

    const updateCitiesOnFix = ((city: City) => {
        if (cities){
            setCities(cities.map((c) => (c.id === city.id ? city : c)))
        }
    })

    const updateCitiesOnAdd = ((city: City) => {
        if (cities){
            setCities([...cities, city])
        }
    })

    const cityRender = cities ? cities
        .filter((city) => {
            return !searchCity || city.city_name.toLowerCase().includes(searchCity.toLowerCase())
        })
        .slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage) : []

    return (
        <div className='py-5'>
            <CityFormModal numberCities={cities ? cities.length : 0} updateCitiesOnAdd={updateCitiesOnAdd}/>
            <Paper className="shadow-sm rounded-xl overflow-hidden border border-gray-100">
            <CitySearch onChangeInputData={setSearchCity} inputData={searchCity} totalCities={cities? cities.length : 0}/>
            {cityRender && <CityTable cities={
                cityRender
                }
                updateCitiesOnDelete={updateCitiesOnDelete}
                    updateCitiesOnFix={updateCitiesOnFix}
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
