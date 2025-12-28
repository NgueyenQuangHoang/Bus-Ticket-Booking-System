import { Add } from '@mui/icons-material';

interface PaymentGatewayHeaderProps {
  count: number;
  onAddClick: () => void;
}

export default function PaymentGatewayHeader({ count, onAddClick }: PaymentGatewayHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Quản lý cổng thanh toán</h1>
        <p className='text-slate-500 text-sm mt-1'>{count} cổng</p>
      </div>
      <button 
        onClick={onAddClick}
        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer'
      >
        <Add sx={{ fontSize: 20 }} />
        <span>Thêm cổng</span>
      </button>
    </div>
  );
}
