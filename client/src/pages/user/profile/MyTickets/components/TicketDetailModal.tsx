
import { Close } from '@mui/icons-material';
import type { TicketUI } from '../../../../../services/ticketService';
// import { QRCodeSVG } from 'qrcode.react'; // Not installed

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketUI | null;
}

export default function TicketDetailModal({ isOpen, onClose, ticket }: TicketDetailModalProps) {
  if (!isOpen || !ticket) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in transform transition-all">
        {/* HEADER */}
        <div className="bg-[#1295DB] px-6 py-4 flex items-center justify-between text-white">
          <h2 className="text-lg font-bold">Chi tiết vé xe</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full hover:cursor-pointer"
          >
            <Close />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* QR CODE SECTION */}
          <div className="flex flex-col items-center justify-center mb-6 pt-2">
             <div className="bg-white p-3 rounded-xl border-2 border-dashed border-gray-200 shadow-sm flex items-center justify-center h-32 w-32">
                {/* <QRCodeSVG value={ticket.code} size={120} /> */}
                <span className="text-xs text-gray-400">QR Code Placeholder</span>
             </div>
             <p className="mt-3 text-sm font-semibold text-gray-500 tracking-wider uppercase">Mã vé: <span className="text-[#1295DB] text-lg">{ticket.code}</span></p>
          </div>

          {/* INFO GRID */}
          <div className="space-y-4">
              {/* ROUTE INFO */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                       <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Nhà xe</span>
                       <span className="text-sm font-bold text-gray-800 text-right">{ticket.busInfo.name}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-0.5">Tuyến đường</div>
                      <div className="font-semibold text-gray-700">{ticket.busInfo.route}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <div className="text-xs text-gray-400 mb-0.5">Giờ xuất bến</div>
                          <div className="font-bold text-[#1295DB] text-lg">{ticket.busInfo.time}</div>
                          <div className="text-xs text-gray-500">{ticket.busInfo.date}</div>
                      </div>
                      <div className="text-right">
                           <div className="text-xs text-gray-400 mb-0.5">Loại xe</div>
                           <div className="font-medium text-gray-700">{ticket.busInfo.type}</div>
                      </div>
                  </div>
              </div>

              {/* LOCATION & SEAT */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Điểm đón</div>
                      <div className="text-sm font-medium text-gray-800 leading-snug">{ticket.pickup}</div>
                  </div>
                   <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Điểm trả</div>
                      <div className="text-sm font-medium text-gray-800 leading-snug">{ticket.dropoff}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Số ghế</div>
                      <div className="text-sm font-bold text-gray-800">{ticket.seats.join(', ') || 'N/A'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Giá vé</div>
                      <div className="text-sm font-bold text-[#1295DB]">{ticket.busInfo.price.toLocaleString()}đ</div>
                  </div>
              </div>

               {/* STATUS */}
               <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                   <span className="text-sm text-gray-500 font-medium">Trạng thái</span>
                   {ticket.status === "COMPLETED" && <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded-md">Đã hoàn thành</span>}
                   {ticket.status === "BOOKED" && <span className="text-blue-600 font-bold text-sm bg-blue-100 px-2 py-1 rounded-md">Đã đặt</span>}
                   {ticket.status === "CANCELLED" && <span className="text-red-600 font-bold text-sm bg-red-100 px-2 py-1 rounded-md">Đã hủy</span>}
               </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-sm hover:cursor-pointer"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
}
