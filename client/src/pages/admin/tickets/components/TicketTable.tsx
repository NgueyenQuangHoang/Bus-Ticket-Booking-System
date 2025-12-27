import { Visibility } from "@mui/icons-material";

export type TicketStatus = "BOOKED" | "CANCELLED" | "COMPLETED" | "USED"; // Added USED
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED"; // Added PaymentStatus

// Match backend structure + UI helpers
export type TicketUI = {
  // Backend keys
  ticket_id: number;
  ticket_code: string; // NEW: Display code for user
  user_id: number;
  schedule_id: number;
  seat_id: number;
  seat_type: string;
  price: number;
  status: TicketStatus;
  payment_status: PaymentStatus; // NEW: Payment status
  created_at: string;
  updated_at?: string;
  id?: string; // string ID from old structure, can map to ticket_code if redundant of keep for safety

  // UI Helper fields (to be populated from IDs)
  customer_name?: string; 
  trip_name?: string; 
};

type Props = {
  data: TicketUI[];
  onView?: (item: TicketUI) => void;
};

export default function TicketTable({ data, onView }: Props) {
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      {/* ================= TABLE (>= 1024px? actually standard responsive) ================= */}
      <div className="hidden [@media(min-width:640px)]:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className='bg-slate-50 border-b border-slate-200'>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Mã vé</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Khách hàng</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Chuyến</th>
              <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Giá vé</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Trạng thái</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Ngày đặt</th>
              <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {data.map((item) => (
              <tr key={item.ticket_id} className='hover:bg-slate-50 transition-colors'>
                {/* ID */}
                <td className='px-6 py-4 text-sm text-slate-600 font-medium'>
                  #{item.ticket_id}
                </td>

                {/* CUSTOMER */}
                {/* CUSTOMER */}
                <td className='px-6 py-4 text-sm font-medium text-slate-900'>
                  {item.customer_name || `User #${item.user_id}`}
                </td>

                {/* TRIP */}
                <td className='px-6 py-4 text-sm text-slate-600 font-medium'>
                  #{item.trip_name || item.schedule_id}
                </td>

                {/* PRICE */}
                <td className='px-6 py-4 text-sm font-bold text-slate-900 text-right'>
                  {formatCurrency(item.price)}
                </td>

                {/* STATUS */}
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-bold
                      ${
                        item.status === "BOOKED"
                          ? "bg-green-100 text-green-700"
                          : item.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </td>

                {/* DATE */}
                <td className='px-6 py-4 text-center text-sm text-slate-600'>
                   {item.created_at}
                </td>

                {/* ACTION */}
                <td className='px-6 py-4 text-right'>
                  <button 
                      onClick={() => onView?.(item)}
                      className='p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center hover:cursor-pointer'
                      title="Xem chi tiết"
                    >
                        <Visibility sx={{ fontSize: 18 }} />
                    </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Không có dữ liệu vé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE (< 640px) ================= */}
      <div className="space-y-4 p-4 [@media(min-width:640px)]:hidden">
        {data.map((item) => (
          <div
            key={item.ticket_id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900">#{item.ticket_id}</p>
                <p className="text-sm text-slate-500">{item.customer_name || `User #${item.user_id}`}</p>
              </div>
              <span
                className={`
                  px-2 py-1 rounded text-xs font-bold
                  ${
                    item.status === "BOOKED"
                      ? "bg-green-100 text-green-700"
                      : item.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-600">Chuyến:</div>
                <div className="font-medium text-slate-900">#{item.trip_name || item.schedule_id}</div>
                
                <div className="text-slate-600">Giá vé:</div>
                <div className="font-bold text-slate-900">{formatCurrency(item.price)}</div>

                <div className="text-slate-600">Ngày đặt:</div>
                <div className="text-slate-800">{item.created_at}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
