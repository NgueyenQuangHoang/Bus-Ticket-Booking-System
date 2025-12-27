import type { ScheduleStatus } from "../../../../types/route";
import { Edit, Delete } from "@mui/icons-material";

export type ScheduleUI = {
  schedule_id: number;
  route_id: number;
  bus_id: number;
  route_name?: string;
  bus_name?: string;
  bus_license?: string;
  departure_time_str?: string; 
  available_seat?: number;
  total_seats?: number;
  status: ScheduleStatus;
};

type Props = {
  data: ScheduleUI[];
  onEdit?: (item: ScheduleUI) => void;
  onDelete?: (item: ScheduleUI) => void;
};

export default function ScheduleTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      {/* ================= TABLE (>= 391px) ================= */}
      <div className="hidden [@media(min-width:391px)]:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className='bg-slate-50 border-b border-slate-200'>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Tuyến</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Xe</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Giờ đi</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Ghế trống</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Trạng thái</th>
              <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {data.map((item) => (
              <tr key={item.schedule_id} className='hover:bg-slate-50 transition-colors'>
                {/* ID */}
                <td className='px-6 py-4 text-sm text-slate-600 font-medium'>
                  #{item.schedule_id}
                </td>

                {/* ROUTE */}
                <td className='px-6 py-4 text-sm font-medium text-slate-900'>
                  {item.route_name || `Route #${item.route_id}`}
                </td>

                {/* BUS */}
                <td className='px-6 py-4'>
                  <div className="text-sm font-medium text-slate-900">{item.bus_name || `Bus #${item.bus_id}`}</div>
                  {item.bus_license && <div className="text-xs text-slate-500">{item.bus_license}</div>}
                </td>

                {/* DEPARTURE */}
                <td className='px-6 py-4 text-center text-sm text-slate-600 font-mono'>
                  {item.departure_time_str || "—"}
                </td>

                {/* SEATS */}
                <td className='px-6 py-4 text-center text-sm'>
                  <span className="font-medium text-slate-700">{item.available_seat}</span>
                  <span className="text-slate-400">/{item.total_seats}</span>
                </td>

                {/* STATUS */}
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`
                      px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        item.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : item.status === "FULL"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {item.status ?? "—"}
                  </span>
                </td>

                {/* ACTION */}
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-end gap-2'>
                    <button 
                      onClick={() => onEdit?.(item)}
                      className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors hover:cursor-pointer'
                      title="Chỉnh sửa"
                    >
                        <Edit sx={{ fontSize: 20 }} />
                    </button>

                    <button 
                      onClick={() => onDelete?.(item)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer'
                      title="Xóa"
                    >
                        <Delete sx={{ fontSize: 20 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Không có dữ liệu lịch trình
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE (< 391px) ================= */}
      <div className="space-y-4 p-4 [@media(min-width:391px)]:hidden">
        {data.map((item) => (
          <div
            key={item.schedule_id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900">{item.route_name}</p>
                <p className="text-xs text-slate-500 mt-1">ID: #{item.schedule_id}</p>
              </div>
              <span
                className={`
                  px-2 py-1 rounded text-xs font-bold
                  ${
                    item.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-600">Xe:</div>
              <div className="font-medium text-slate-900">{item.bus_name}</div>
              
              <div className="text-slate-600">Giờ đi:</div>
              <div className="text-slate-800">{item.departure_time_str}</div>

              <div className="text-slate-600">Ghế trống:</div>
              <div className="text-slate-800">{item.available_seat}/{item.total_seats}</div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => onEdit?.(item)}
                className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors'
              >
                  <Edit sx={{ fontSize: 20 }} />
              </button>
              <button 
                onClick={() => onDelete?.(item)}
                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
              >
                  <Delete sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
