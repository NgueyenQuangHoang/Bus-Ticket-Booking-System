import type { Bus } from '../../../../../types/bus';
import { Button } from '@mui/material';

interface Props {
  buses: Bus[];
  selectedBusId: number | string;
  onBusChange: (busId: string) => void;
  onCreateLayout: () => void;
}

export default function SeatToolbar({ buses, selectedBusId, onBusChange, onCreateLayout }: Props) {
  return (
    <div className='flex-1 min-w-[300px] flex items-end gap-4'> {/* Sửa items-center thành items-end */}
      <div className='flex-1'>
        <p className='text-sm font-medium mb-1'>Chọn xe:</p>
        <div className='bg-gray-50 rounded-lg px-3 py-2 border flex items-center h-[40px]'> {/* Nên đặt chiều cao cố định cho ô input */}
          <select 
            className='bg-transparent w-full outline-none text-sm'
            value={selectedBusId}
            onChange={(e) => onBusChange(e.target.value)}
          >
            <option value="">Chọn xe để cấu hình...</option>
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.name || bus.license_plate} - {bus.license_plate}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        variant="contained" 
        color="primary"
        onClick={onCreateLayout}
        disabled={!selectedBusId}
        startIcon={<i className="fa-solid fa-plus"></i>}
        className="normal-case whitespace-nowrap h-[40px]" // Thêm chiều cao cố định bằng với ô input (ví dụ h-[40px])
      >
        Chọn mẫu sơ đồ ghế
      </Button>
    </div>
  );
}