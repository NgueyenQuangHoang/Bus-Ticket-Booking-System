import { Add } from '@mui/icons-material';

interface RoleHeaderProps {
  count: number;
  onAddClick: () => void;
}

export default function RoleHeader({ count, onAddClick }: RoleHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý Phân quyền</h1>
        <p className='text-slate-500 mt-1'>
          Quản lý {count} phân quyền user
        </p>
      </div>

      <button 
        onClick={onAddClick}
        className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-blue-200 hover:shadow-blue-300 cursor-pointer'
      >
        <Add />
        <span>Thêm phân quyền</span>
      </button>
    </div>
  );
}
