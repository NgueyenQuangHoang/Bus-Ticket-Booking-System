import { Delete, Edit } from '@mui/icons-material';
import type { PaymentProvider } from '../PaymentGatewaysPage';

interface PaymentGatewayTableProps {
  payments: PaymentProvider[];
  onDelete: (id: number) => void;
  onEdit: (provider: PaymentProvider) => void;
}

export default function PaymentGatewayTable({ payments, onDelete, onEdit }: PaymentGatewayTableProps) {
    const getTypeColor = (type: string) => {
        switch(type) {
            case 'GATEWAY': return 'bg-blue-100 text-blue-700';
            case 'WALLET': return 'bg-purple-100 text-purple-700';
            case 'QR_CODE': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-200'>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Tên cổng</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Loại</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>API Endpoint</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {payments.map((p) => (
                <tr key={p.payment_provider_id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-600 font-medium'>#{p.payment_provider_id}</td>
                  <td className='px-6 py-4 text-sm font-medium text-slate-900'>{p.provider_name}</td>
                   <td className='px-6 py-4'>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(p.provider_type)}`}>
                        {p.provider_type}
                    </span>
                   </td>
                  <td className='px-6 py-4 text-sm text-slate-500 max-w-xs truncate'>{p.api_endpoint}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                        <button 
                            onClick={() => onEdit(p)}
                            className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer'
                            title="Sửa"
                        >
                            <Edit sx={{ fontSize: 18 }} />
                        </button>
                        <button 
                            onClick={() => onDelete(p.payment_provider_id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
                            title="Xóa"
                        >
                            <Delete sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
            <span className='text-sm text-slate-500'>Tổng: <span className='font-medium'>{payments.length}</span></span>
        </div>
      </div>
  );
}
