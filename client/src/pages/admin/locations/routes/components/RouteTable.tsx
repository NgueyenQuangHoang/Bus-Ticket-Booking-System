
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip
} from '@mui/material';
import RouteAction from './RouteAction';


export default function RouteTable() {

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
                    <TableRow hover className="transition-colors">
                        <TableCell className="text-gray-600">kasjdlfkjsf</TableCell>
                        <TableCell className="font-medium">alkskdjflasjd</TableCell>
                        <TableCell className="font-medium">alkskdjflasjd</TableCell>
                        <TableCell className="font-medium">alkskdjflasjd</TableCell>
                        <TableCell className="font-medium">alkskdjflasjd</TableCell>
                        <TableCell>
                            <Chip
                                label="{city.region}"
                                size="small"
                                className={` 'bg-blue-50 text-blue-600' :
                                    city.region === 'Bắc' ? 'bg-blue-50 text-blue-600' :
                                        'bg-blue-50 text-blue-600'
                                    } font-medium px-2`}
                            />
                        </TableCell>
                        <TableCell align="right">
                            <RouteAction />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    )
}
