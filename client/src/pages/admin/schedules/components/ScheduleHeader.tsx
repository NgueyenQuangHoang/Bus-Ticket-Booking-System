import { Add } from '@mui/icons-material';

interface ScheduleHeaderProps {
  totalCount: number;
  onAddClick: () => void;
}

export default function ScheduleHeader({ totalCount, onAddClick }: ScheduleHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý lịch trình</h1>
        <p className='text-slate-500 text-sm mt-1'>{totalCount} chuyến</p>
      </div>
      <button 
        onClick={onAddClick}
        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-blue-200 hover:cursor-pointer'
      >
        <Add sx={{ fontSize: 20 }} />
        <span>Tạo lịch trình</span>
      </button>
    </div>
  );
}
