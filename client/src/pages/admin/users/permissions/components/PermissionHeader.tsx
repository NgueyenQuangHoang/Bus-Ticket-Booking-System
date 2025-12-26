import { Add } from '@mui/icons-material';

interface PermissionHeaderProps {
  count: number;
  onAddClick: () => void;
}

export default function PermissionHeader({ count, onAddClick }: PermissionHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý Quyền (Definitions)</h1>
        <p className='text-slate-500 text-sm mt-1'>{count} quyền</p>
      </div>
      <button 
        onClick={onAddClick}
        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer'
      >
        <Add sx={{ fontSize: 20 }} />
        <span>Thêm quyền</span>
      </button>
    </div>
  );
}
