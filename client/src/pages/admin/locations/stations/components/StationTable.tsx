import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip
} from '@mui/material';
import StationAction from './StationAction';
import type { City, Station } from '../../../../../types';
import { useAppSelector } from '../../../../../hooks';

interface PropType {
  stations: (Station & { city_name?: string })[]
  onDelete: (station: Station) => void
  onEdit: (station: Station) => void
}

export default function StationTable({ stations, onDelete, onEdit }: PropType) {
  const { cities } = useAppSelector(state => state.city);

  const cityMapping: Record<string, string> = cities.reduce((acc, city) => {
    return {
      ...acc,
      [city.id]: city.city_name
    };
  }, {});
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell className="font-bold text-gray-400">#</TableCell>
            <TableCell className="font-bold text-gray-400">Tên</TableCell>
            <TableCell className="font-bold text-gray-400">Thành phố</TableCell>
            <TableCell className="font-bold text-gray-400">Địa chỉ</TableCell>

            <TableCell align="right" className="font-bold text-gray-400">THAO TÁC</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            stations.map((station, index) => (
              <TableRow key={station.id} hover className="transition-colors">
                <TableCell className="text-gray-600">{index + 1}</TableCell>
                <TableCell className="font-medium">{station.station_name}</TableCell>
                <TableCell className="font-medium">{cityMapping[station.city_id]}</TableCell>

                <TableCell>
                  <Chip
                    label={station.location}
                    size="small"
                    className={` 'bg-blue-50 text-blue-600' :
                                    city.region === 'Bắc' ? 'bg-blue-50 text-blue-600' :
                                        'bg-blue-50 text-blue-600'
                                    } font-medium px-2`}
                  />
                </TableCell>
                <TableCell align="right">
                  <StationAction onDelete={onDelete} onEdit={onEdit} station={station} cities={cities}/>
                </TableCell>
              </TableRow>
            ))
          }
          {/* {<TableRow hover className="transition-colors">
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
          </TableRow>} */}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
