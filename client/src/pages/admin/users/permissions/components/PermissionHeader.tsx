import { Add } from '@mui/icons-material';


export default function PermissionHeader({openFormAdd}: {openFormAdd: () => void}) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý Quyền (Definitions)</h1>
      </div>
      <button 
        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer'
        onClick={openFormAdd}
      >
        <Add sx={{ fontSize: 20 }} />
        <span>Thêm quyền</span>
      </button>
    </div>
  );
}
