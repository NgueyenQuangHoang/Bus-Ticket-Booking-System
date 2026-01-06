import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip
} from '@mui/material';
import type { City } from '../../../../../types';
import CityAction from './CityAction';

interface PropType {
    cities: City[],
    onDelete: (city: City) => void
    onUpdateCities: (city: City) => void
}

export default function CityTable({ cities, onDelete, onUpdateCities }: PropType) {
    console.log(cities);
    
    return (

        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead className="bg-gray-50">
                    <TableRow>
                        <TableCell className="font-bold text-gray-400">ID</TableCell>
                        <TableCell className="font-bold text-gray-400">TÊN THÀNH PHỐ</TableCell>
                        <TableCell className="font-bold text-gray-400">VÙNG MIỀN</TableCell>
                        <TableCell align="right" className="font-bold text-gray-400">THAO TÁC</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cities.map((city, index) => (
                        <TableRow key={city.id} hover className="transition-colors">
                            <TableCell className="text-gray-600">{index+1}</TableCell>
                            <TableCell className="font-medium">{city.city_name}</TableCell>
                            <TableCell>
                                <Chip
                                    label={city.region}
                                    size="small"
                                    className={`${city.region === 'Nam' ? 'bg-blue-50 text-blue-600' :
                                        city.region === 'Bắc' ? 'bg-blue-50 text-blue-600' :
                                            'bg-blue-50 text-blue-600'
                                        } font-medium px-2`}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <CityAction
                                    onDelete={onDelete}
                                    updateCitiesOnFix={onUpdateCities}
                                    city={city}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )
}
