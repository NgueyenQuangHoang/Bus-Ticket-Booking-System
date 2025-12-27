import { Close, Print, Cancel } from "@mui/icons-material";
import type { TicketUI } from "./TicketTable";

type Props = {
  open: boolean;
  onClose: () => void;
  ticket?: TicketUI | null;
  onCancel: () => void;
};

// Extended mock data generator for detail view
const getDetailMock = (ticket: TicketUI | null | undefined) => {
    if (!ticket) return null;
    return {
        ...ticket,
        phone: "0901234567",
        email: "customer@example.com",
        seat_number: `A${(ticket.ticket_id % 40) + 1}`,
        payment_method: "Momo",
        payment_status: "PAID",
        bus_license: "51B-123.45",
        route_details: "Bến xe Miền Đông -> Bến xe Đà Lạt",
        departure_time: "22:00",
    };
};

export default function TicketDetailModal({ open, onClose, ticket,  onCancel }: Props) {
  if (!open || !ticket) return null;

  const detailData = getDetailMock(ticket);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-zoom-in overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                 <span className="font-bold text-lg">#{ticket.ticket_id}</span>
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800">Chi tiết vé</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${ticket.status === 'BOOKED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ticket.status}
                </span>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
            <Close />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Customer Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Thông tin khách hàng</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-500 block">Họ và tên</label>
                        <p className="font-medium text-slate-800">{ticket.customer_name}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block">Số điện thoại</label>
                        <p className="font-medium text-slate-800">{detailData?.phone}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block">Email</label>
                        <p className="font-medium text-slate-800">{detailData?.email}</p>
                    </div>
                </div>
            </div>

            {/* Trip Section */}
            <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Thông tin chuyến đi</h3>
                 <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-500 block">Tuyến xe</label>
                        <p className="font-medium text-slate-800">{detailData?.route_details}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                             <label className="text-xs text-slate-500 block">Biển số xe</label>
                             <p className="font-bold text-slate-800">{detailData?.bus_license}</p>
                        </div>
                        <div>
                             <label className="text-xs text-slate-500 block">Khởi hành</label>
                             <p className="font-bold text-blue-600">{detailData?.departure_time} - {ticket.created_at}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Section - Full Width */}
            <div className="md:col-span-2 pt-2">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Thông tin thanh toán</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 block">Giá vé</label>
                            <p className="font-bold text-lg text-slate-800">{formatCurrency(ticket.price)}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block">Ghế</label>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-slate-800">{detailData?.seat_number}</span>
                                <span className="text-xs text-slate-500">{ticket.seat_type}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block">Phương thức</label>
                             <p className="font-medium text-slate-800">{detailData?.payment_method}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block">Trạng thái TT</label>
                             <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded inline-block mt-1">
                                {detailData?.payment_status}
                             </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors hover:cursor-pointer"
            >
                Đóng
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium transition-colors hover:cursor-pointer">
                <Print sx={{ fontSize: 18 }} />
                In vé
            </button>
             {ticket.status === 'BOOKED' && (
                <button 
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors hover:cursor-pointer"
                >
                    <Cancel sx={{ fontSize: 18 }} />
                    Hủy vé
                </button>
             )}
        </div>
      </div>
    </div>
  );
}
