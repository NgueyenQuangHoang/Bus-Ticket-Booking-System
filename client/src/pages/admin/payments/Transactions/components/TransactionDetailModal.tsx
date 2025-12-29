import { Close, Description, Lock } from '@mui/icons-material';
import type { Transaction } from './TransactionTable';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!isOpen || !transaction) return null;

  // Mock secondary data since we only have transaction info
  const ticketInfo = {
      route: "Bến xe Miền Đông → Kon Tum",
      time: "22/12/2025 - 17:15",
      seat: "A3 (VIP)",
      status: transaction.status === 'REFUNDED' ? 'CANCELLED' : 'CONFIRMED'
  };

  const userInfo = {
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0909 123 456",
      passenger: "Nguyễn Văn A | CCCD: 012345678912"
  };

  const getProviderName = (id: number) => {
    const providers: Record<number, string> = { 1: 'VNPay', 2: 'MoMo', 3: 'ZaloPay' };
    return providers[id] || `Provider #${id}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Format similar to screenshot
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    // Or full format if needed: return date.toLocaleString('vi-VN');
  };
  
  const getStatusColor = (status: string) => {
      switch(status) {
          case 'COMPLETED': return 'bg-green-100 text-green-700';
          case 'PENDING': return 'bg-yellow-100 text-yellow-700';
          case 'FAILED': return 'bg-red-100 text-red-700';
          case 'REFUNDED': return 'bg-blue-100 text-blue-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const handleExport = () => {
    alert("Đang phát triển");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-in">
        
        {/* Header - Styled like Ticket Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                     <span className="font-bold text-lg">{transaction.transaction_code.substring(0, 3)}</span>
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-800">Chi tiết giao dịch</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{transaction.transaction_code}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                        </span>
                    </div>
                 </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
                <Close />
            </button>
        </div>
        
        <div className="p-6 space-y-6">
            {/* Transaction Info - Structure from Screenshot 2, Style from Ticket Modal */}
             <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Thông tin giao dịch
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Cổng thanh toán</label>
                        <p className="font-medium text-slate-800">{getProviderName(transaction.payment_provider_id)}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Phương thức</label>
                        <p className="font-medium text-slate-800">{transaction.payment_method}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Số tiền</label>
                        <p className="font-bold text-lg text-blue-600">{formatCurrency(transaction.amount)}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Ngày thanh toán</label>
                        <p className="font-medium text-slate-800">{formatDate(transaction.paid_at)}</p>
                    </div>
                 </div>
            </div>

            {/* Ticket Info */}
            <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Thông tin vé
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">Mã vé</label>
                         <p className="font-bold text-slate-800">#{transaction.ticket_id}</p>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">Trạng thái vé</label>
                         <p className="font-medium text-slate-800">{ticketInfo.status}</p>
                    </div>
                    <div className="md:col-span-2">
                         <label className="text-xs text-slate-500 block mb-1">Tuyến xe</label>
                         <p className="font-medium text-slate-800">{ticketInfo.route}</p>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">Thời gian</label>
                         <p className="font-medium text-slate-800">{ticketInfo.time}</p>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">Ghế</label>
                         <p className="font-medium text-slate-800">{ticketInfo.seat}</p>
                    </div>
                 </div>
            </div>

             {/* User Info */}
             <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    Người đặt & Hành khách
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">Người đặt</label>
                         <p className="font-medium text-slate-800">{userInfo.name}</p>
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 block mb-1">SĐT</label>
                         <p className="font-medium text-slate-800">{userInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                         <label className="text-xs text-slate-500 block mb-1">Email</label>
                         <p className="font-medium text-slate-800">{userInfo.email}</p>
                    </div>
                    <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg">
                         <label className="text-xs text-slate-500 block mb-1">Hành khách</label>
                         <p className="font-medium text-slate-800 text-sm">• {userInfo.passenger}</p>
                    </div>
                 </div>
            </div>

        </div>

        {/* Footer - Styled like Ticket Modal */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Lock sx={{ fontSize: 16 }} className="text-orange-500" />
                <span>Không được phép chỉnh sửa dữ liệu</span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                 {(transaction.status === 'COMPLETED' || transaction.status === 'REFUNDED') && (
                     <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors hover:cursor-pointer">
                        <Description sx={{ fontSize: 18 }} />
                        Xuất hóa đơn
                    </button>
                 )}
                <button 
                    onClick={onClose}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors hover:cursor-pointer shadow-sm shadow-blue-200"
                >
                    Đóng
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
