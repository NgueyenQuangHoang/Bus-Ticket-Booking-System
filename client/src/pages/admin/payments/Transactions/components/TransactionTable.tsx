import { Visibility, ChevronLeft, ChevronRight } from '@mui/icons-material';

export interface Transaction {
    payment_id: number;
    ticket_id: number;
    user_id: number;
    payment_provider_id: number;
    payment_method: string;
    amount: number;
    transaction_code: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
    paid_at: string;
    created_at: string;
    updated_at: string;
    id: string;
    // Helper fields for display mapping
    provider_name?: string; 
}

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export default function TransactionTable({ 
    transactions, 
    onViewDetail,
    currentPage,
    totalPages,
    onPageChange,
    totalItems
}: TransactionTableProps) {
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'FAILED': return 'bg-red-100 text-red-700';
            case 'REFUNDED': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Helper to get provider name (mock mapping since we only have ID in data but UI shows Name)
    const getProviderName = (id: number) => {
        const providers: Record<number, string> = { 1: 'VNPay', 2: 'MoMo', 3: 'ZaloPay' };
        return providers[id] || `Provider #${id}`;
    };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-200'>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>MÃ GD</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>MÃ VÉ</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>CỔNG TT</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>SỐ TIỀN</th>
                <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>TRẠNG THÁI</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>NGÀY TT</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>THAO TÁC</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {transactions.map((t, index) => (
                <tr key={t.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-600 font-medium'>{(currentPage - 1) * 10 + index + 1}</td>
                  <td className='px-6 py-4 text-sm font-medium text-slate-900'>{t.transaction_code}</td>
                  <td className='px-6 py-4 text-sm text-slate-600'>#{t.ticket_id}</td>
                  <td className='px-6 py-4 text-sm text-slate-900'>{t.provider_name || getProviderName(t.payment_provider_id)}</td>
                  <td className='px-6 py-4 text-sm text-slate-900 font-medium'>{formatCurrency(t.amount)}</td>
                   <td className='px-6 py-4 text-center'>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(t.status)}`}>
                        {t.status}
                    </span>
                   </td>
                  <td className='px-6 py-4 text-sm text-slate-500'>{formatDate(t.paid_at)}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end'>
                        <button 
                            onClick={() => onViewDetail(t)}
                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer'
                            title="Xem chi tiết"
                        >
                            <Visibility sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
            <span className='text-sm text-slate-500'>
                Hiển thị <span className='font-medium'>{transactions.length}</span> / <span className='font-medium'>{totalItems}</span> giao dịch
            </span>
            
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer'
                >
                    <ChevronLeft sx={{ fontSize: 20 }} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer
                            ${currentPage === page 
                                ? 'bg-blue-600 text-white' 
                                : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer'
                >
                    <ChevronRight sx={{ fontSize: 20 }} />
                </button>
            </div>
        </div>
      </div>
  );
}
