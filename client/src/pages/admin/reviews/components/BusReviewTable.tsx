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
        bg-gray-50 text-xs text-gray-500 border-b border-gray-200 font-semibold"
      >
        <div className="p-3">ID</div>
        <div className="p-3">Người dùng</div>
        <div className="p-3">Xe / Mã vé</div>
        <div className="p-3">Đánh giá</div>
        <div className="p-3">Nội dung</div>
        <div className="p-3">Trạng thái</div>
        <div className="p-3 text-center">Thao tác</div>
      </div>

      {/* TABLE BODY */}
      {data.map((item: Review) => (
        <div
          key={item.id}
          className="border-t border-gray-200 sm:grid sm:grid-cols-[60px_2fr_2fr_1.5fr_2fr_1fr_100px] items-center text-sm"
        >
          <div className="hidden sm:block p-3 font-mono text-xs text-gray-500 truncate" title={String(item.id)}>{String(item.id).substring(0, 6)}...</div>
          <div className="hidden sm:block p-3 font-medium text-gray-700">{getUserName(item.user)}</div>
          <div className="hidden sm:block p-3 text-xs">
             <div className="text-gray-900 font-medium truncate" title={item.booking_id}>Vé: {item.booking_id}</div>
             <div className="text-gray-500 truncate" title={item.bus?.name || item.bus_id}>
                <span>Xe: </span>
                <span className="font-semibold text-gray-700">
                    {item.bus?.name || (item.bus_id && item.bus_id.length > 8 ? `${item.bus_id.substring(0,8)}...` : item.bus_id)}
                </span>
             </div>
          </div>

          <div className="hidden sm:flex p-3 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
 <StarIcon
      key={i}
      className={i < item.rating ? "text-yellow-400" : "text-gray-200"}
      fontSize="inherit"
      sx={{ fontSize: 16 }}
    />            ))}
          </div>

          <div className="hidden sm:block p-3 text-gray-600 truncate" title={item.review}>{item.review}</div>

          <div className="hidden sm:block p-3">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.status === "VISIBLE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.status === "VISIBLE" ? "Hiện" : "Ẩn"}
            </span>
          </div>

          <div className="hidden sm:flex justify-center gap-3 p-3">
            <button 
                onClick={() => onEdit(item)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors"
                title="Sửa"
            >
                <EditIcon fontSize="small" />
            </button>
            <button 
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
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
