
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip
} from '@mui/material';
import RouteAction from './RouteAction';
import type { Route } from '../../../../../types';

interface PropType {
    routes: Route[],
    stationMapping: {[key: string]: string},
}

export default function RouteTable({routes, stationMapping: stations} : PropType) {

    return (

        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead className="bg-gray-50">
                    <TableRow>
                        <TableCell className="font-bold text-gray-400">ID</TableCell>
                        <TableCell className="font-bold text-gray-400">Điểm đi</TableCell>
                        <TableCell className="font-bold text-gray-400">Điểm đến</TableCell>
                        <TableCell className="font-bold text-gray-400">Khoảng cách</TableCell>
                        <TableCell className="font-bold text-gray-400">Thời gian</TableCell>
                        <TableCell className="font-bold text-gray-400">Giá</TableCell>
                        <TableCell align="right" className="font-bold text-gray-400">THAO TÁC</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {routes.map((item, index) => {
                        return (
                            <TableRow key={index} hover className="transition-colors">
                                <TableCell className="text-gray-600">{index+1}</TableCell>
                                <TableCell className="font-medium">{stations[item.departure_station_id]}</TableCell>
                                <TableCell className="font-medium">{stations[item.arrival_station_id]}</TableCell>
                                <TableCell className="font-medium">{item.distance} km</TableCell>
                                <TableCell className="font-medium">{item.duration} phút</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.base_price}
                                        size="small"
                                        className={` 'bg-blue-50 text-blue-600' :
                                    city.region === 'Bắc' ? 'bg-blue-50 text-blue-600' :
                                        'bg-blue-50 text-blue-600'
                                    } font-medium px-2`}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <RouteAction id={item.id} route={item}/>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>

    )
}
