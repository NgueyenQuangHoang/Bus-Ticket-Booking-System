import { useMemo } from "react";
import type { TicketUI } from "../../../../../services/ticketService";
import CloseIcon from '@mui/icons-material/Close';

interface CancelTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ticketId: string) => void;
  ticket: TicketUI | null;
}

export default function CancelTicketModal({ isOpen, onClose, onConfirm, ticket }: CancelTicketModalProps) {
  if (!isOpen || !ticket) return null;

  // Mock Policy Config
  const CANCELLATION_FEE_PERCENT = 30; // 30% fee
  const REFUND_PERCENT = 100 - CANCELLATION_FEE_PERCENT; // 70% refund

  const originalPrice = ticket.busInfo.price;
  const refundAmount = (originalPrice * REFUND_PERCENT) / 100;
  const feeAmount = originalPrice - refundAmount;

  // Mock Seat (use code suffix or random if not available)
  const mockSeat = useMemo(() => {
    // Try to extract seat from code if it looks like "TICKET-A5"
    const parts = ticket.code.split('-');
    if (parts.length > 1 && parts[parts.length - 1].length <= 3) {
      return parts[parts.length - 1]; 
    }
    // Else random seat
    return `A${Math.floor(Math.random() * 20) + 1}`;
  }, [ticket.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-fade-in-up transform transition-all">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 bg-red-50 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
          <h3 className="text-xl font-bold text-red-700 flex items-center gap-3 relative z-10">
            Yêu cầu hủy vé
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full hover:bg-gray-100 relative z-10 hover:cursor-pointer flex items-center justify-center p-1">
             <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          <div className="text-center">
             <p className="text-gray-600">
               Bạn đang yêu cầu hủy vé cho chuyến đi <strong>{ticket.busInfo.route}</strong>.
             </p>
             <p className="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
          </div>

          {/* TICKET CARD */}
          <div className="bg-white border text-sm border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#1295DB]"></div>
             <div className="grid grid-cols-2 gap-y-3">
                <div className="text-gray-500">Giờ khởi hành</div>
                <div className="text-right font-medium text-gray-800">{ticket.busInfo.time} - {ticket.busInfo.date}</div>

                <div className="text-gray-500">Nhà xe</div>
                <div className="text-right font-medium text-gray-800">{ticket.busInfo.name}</div>

                <div className="text-gray-500">Vị trí ghế</div>
                <div className="text-right">
                    <span className="font-bold text-[#1295DB] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">{mockSeat}</span>
                </div>
             </div>
          </div>

          {/* REFUND TABLE */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
             <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 border-dashed">
                <span className="text-gray-600">Giá vé gốc</span>
                <span className="font-semibold text-gray-900">{originalPrice.toLocaleString()}đ</span>
             </div>
             <div className="flex justify-between items-center mb-3">
                <span className="text-red-500 text-sm">Phí hủy vé ({CANCELLATION_FEE_PERCENT}%)</span>
                <span className="text-red-500 font-medium">-{feeAmount.toLocaleString()}đ</span>
             </div>
             
             <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-bold text-green-700 text-lg">Số tiền hoàn lại</span>
                <span className="font-bold text-2xl text-green-700">{refundAmount.toLocaleString()}đ</span>
             </div>
          </div>
          
          {/* POLICY NOTE */}
          <div className="flex gap-2 items-start bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
             <span className="text-lg">ℹ️</span>
             <p>Chính sách hủy: Hủy trước 24h hoàn {REFUND_PERCENT}%, hủy trước 12h hoàn 50%. Tiền sẽ được hoàn về ví của bạn trong vòng 24h.</p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-gray-50 flex gap-4 bg-gray-50/50">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors hover:shadow-lg hover:shadow-gray-200/50 hover:cursor-pointer"
          >
            Quay lại
          </button>
          <button
            onClick={() => onConfirm(ticket.id)}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:cursor-pointer"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}
