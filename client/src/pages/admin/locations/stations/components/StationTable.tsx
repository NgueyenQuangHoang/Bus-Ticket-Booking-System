import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip
} from '@mui/material';
import StationAction from './StationAction';

export default function StationTable() {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell className="font-bold text-gray-400">ID</TableCell>
            <TableCell className="font-bold text-gray-400">Tên</TableCell>
            <TableCell className="font-bold text-gray-400">Thành phố</TableCell>
            <TableCell className="font-bold text-gray-400">Địa chỉ</TableCell>

            <TableCell align="right" className="font-bold text-gray-400">THAO TÁC</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover className="transition-colors">
            <TableCell className="text-gray-600">kasjdlfkjsf</TableCell>
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
              <StationAction />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
