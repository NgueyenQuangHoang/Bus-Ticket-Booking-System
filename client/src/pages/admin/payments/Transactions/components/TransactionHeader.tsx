import { Download } from '@mui/icons-material';

interface TransactionHeaderProps {
  count: number;
  onExport: () => void;
}

export default function TransactionHeader({ count, onExport }: TransactionHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý thanh toán</h1>
        <p className='text-slate-500 text-sm mt-1'>{count} giao dịch</p>
      </div>
      <button 
        onClick={onExport}
        className='bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer border border-slate-200'
      >
        <Download sx={{ fontSize: 20 }} />
        <span>Xuất báo cáo</span>
      </button>
    </div>
  );
}
