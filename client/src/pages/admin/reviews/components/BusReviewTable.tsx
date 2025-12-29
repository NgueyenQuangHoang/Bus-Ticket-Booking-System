import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from '@mui/icons-material/Star';

export type Review = {
  id: number;
  user: string;
  bus: string;
  rating: number;
  content: string;
  status: "VISIBLE" | "HIDDEN";
};

interface Props {
  data: Review[];
  onEdit: (review: Review) => void;
}

export default function BusReviewTable({ data, onEdit }: Props) {
  return (
    <>
      {/* TABLE HEADER */}
      <div
        className="hidden sm:grid grid-cols-[60px_2fr_2fr_1.5fr_2fr_1fr_100px]
        bg-gray-50 text-xs text-gray-500 border-b border-gray-200"
      >
        <div className="p-3">ID</div>
        <div className="p-3">Người dùng</div>
        <div className="p-3">Xe</div>
        <div className="p-3">Đánh giá</div>
        <div className="p-3">Nội dung</div>
        <div className="p-3">Trạng thái</div>
        <div className="p-3 text-center">Thao tác</div>
      </div>

      {/* TABLE BODY */}
      {data.map((item) => (
        <div
          key={item.id}
          className="border-t border-gray-200 sm:grid sm:grid-cols-[60px_2fr_2fr_1.5fr_2fr_1fr_100px]"
        >
          <div className="hidden sm:block p-3">{item.id}</div>
          <div className="hidden sm:block p-3">{item.user}</div>
          <div className="hidden sm:block p-3">{item.bus}</div>

          <div className="hidden sm:flex p-3 gap-1">
            {Array.from({ length: item.rating }).map((_, i) => (
 <StarIcon
      key={i}
      className="text-yellow-400"
      fontSize="small"
    />            ))}
          </div>

          <div className="hidden sm:block p-3">{item.content}</div>

          <div className="hidden sm:block p-3">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                item.status === "VISIBLE"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.status}
            </span>
          </div>

          <div className="hidden sm:flex justify-center gap-3 p-3">
            <EditIcon
              className="text-green-500 cursor-pointer"
              onClick={() => onEdit(item)}
            />
            <DeleteIcon className="text-red-500 cursor-pointer" />
          </div>
        </div>
      ))}
    </>
  );
}
