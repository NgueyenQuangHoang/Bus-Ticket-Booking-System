import { IconButton, Tooltip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { SeatType } from '../../../../../types/seat';
import SeatTypeFormModal from './SeatTypeFormModal';

interface Props {
  seatTypes: SeatType[];
  onUpdate: (id: number|string, data: Partial<SeatType>) => void;
  onDelete: (id: number|string) => void;
}

export default function SeatTypeTable({ seatTypes, onUpdate, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Loại ghế</th>
            <th className="px-6 py-3">Mô tả</th>
            <th className="px-6 py-3">Màu</th>
            <th className="px-6 py-3">Hệ số giá</th>
            <th className="px-6 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {seatTypes.map((st) => (
            <tr key={st.id || st.seat_type_id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{st.id || st.seat_type_id}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{st.type_name}</td>
              <td className="px-6 py-4 text-gray-500">{st.description}</td>
              <td className="px-6 py-4">
                 <div className='flex items-center gap-2'>
                    <div 
                        className='w-6 h-6 rounded border' 
                        style={{ backgroundColor: st.color }}
                    ></div>
                    <span>{st.color}</span>
                 </div>
              </td>
              <td className="px-6 py-4">{st.price_multiplier}x</td>
              <td className="px-6 py-4 text-right space-x-2">
                 <SeatTypeFormModal 
                    initialData={st}
                    onSubmit={(data: Partial<SeatType>) => onUpdate(st.id || st.seat_type_id || '', data)}
                    isEdit
                 />
                 <Tooltip title="Xóa">
                    <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => onDelete(st.id || st.seat_type_id || '')}
                        className='border border-red-200 hover:bg-red-50'
                    >
                        <DeleteIcon />
                    </IconButton>
                 </Tooltip>
              </td>
            </tr>
          ))}
          {seatTypes.length === 0 && (
             <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Chưa có dữ liệu loại ghế
                </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}