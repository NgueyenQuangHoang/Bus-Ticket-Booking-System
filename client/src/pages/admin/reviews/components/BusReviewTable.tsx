import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from '@mui/icons-material/Star';
import type { Review } from "../../../../services/reviewService";

interface Props {
  data: Review[];
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export default function BusReviewTable({ data, onEdit, onDelete }: Props) {
  const getUserName = (user?: any) => {
    if (!user) return "Người dùng ẩn danh";
    if (user.last_name && user.first_name) {
        return `${user.last_name} ${user.first_name}`;
    }
    return user.full_name || user.fullName || user.name || user.email || "Người dùng ẩn danh";
  }

  return (
    <>
      {/* TABLE HEADER */}
      <div
        className="hidden sm:grid grid-cols-[60px_2fr_2fr_1.5fr_2fr_1fr_100px]
        bg-gray-100/50 text-xs text-gray-500 border-b border-gray-200 font-semibold uppercase tracking-wider"
      >
        <div className="p-4">ID</div>
        <div className="p-4">Người dùng</div>
        <div className="p-4">Xe / Mã vé</div>
        <div className="p-4">Đánh giá</div>
        <div className="p-4">Nội dung</div>
        <div className="p-4">Trạng thái</div>
        <div className="p-4 text-center">Thao tác</div>
      </div>

      {/* TABLE BODY */}
      {data.map((item: Review) => (
        <div
          key={item.id}
          className="border-b last:border-0 border-gray-100 sm:grid sm:grid-cols-[60px_2fr_2fr_1.5fr_2fr_1fr_100px] items-center text-sm hover:bg-blue-50/50 transition-colors duration-150"
        >
          <div className="hidden sm:block p-4 font-mono text-xs text-gray-500 truncate" title={String(item.id)}>
              {item.id.length > 8 ? `${item.id.substring(0, 8)}...` : item.id}
          </div>
          <div className="hidden sm:block p-4 font-medium text-gray-800">{getUserName(item.user)}</div>
          <div className="hidden sm:block p-4 text-xs space-y-1">
             <div className="text-gray-900 font-medium truncate" title={item.booking_id}>
                <span className="text-gray-500">Vé:</span> {item.booking_id}
             </div>
             <div className="text-gray-500 truncate" title={item.bus?.name || item.bus_id}>
                <span className="text-gray-500">Xe:</span> {item.bus?.name || (item.bus_id && item.bus_id.length > 8 ? `${item.bus_id.substring(0,8)}...` : item.bus_id)}
             </div>
          </div>

          <div className="hidden sm:flex p-4 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={i < item.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"}
                fontSize="inherit"
                sx={{ fontSize: 16 }}
              />
            ))}
          </div>

          <div className="hidden sm:block p-4 text-gray-600 truncate italic" title={item.review}>"{item.review}"</div>

          <div className="hidden sm:block p-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                item.status === "VISIBLE"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {item.status === "VISIBLE" ? "Hiện" : "Ẩn"}
            </span>
          </div>

          <div className="hidden sm:flex justify-center gap-2 p-4">
            <button 
                onClick={() => onEdit(item)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all hover:cursor-pointer"
                title="Sửa"
            >
                <EditIcon fontSize="small" />
            </button>
            <button 
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all hover:cursor-pointer"
                title="Xoá"
            >
                <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      ))}
      
      {data.length === 0 && (
          <div className="p-8 text-center text-gray-500">
              Không tìm thấy đánh giá nào.
          </div>
      )}
    </>
  );
}
