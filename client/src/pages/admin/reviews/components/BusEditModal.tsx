import { useState, useEffect } from "react";
import StarIcon from '@mui/icons-material/Star';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import type { Review } from "../../../../services/reviewService";
import busService from "../../../../services/admin/busService";

interface Props {
  open: boolean;
  review: Review | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Review>) => void;
}

const RATING_LABELS: Record<string, string> = {
  safety: "An toàn",
  info_accuracy: "Thông tin chính xác",
  info_completeness: "Thông tin đầy đủ",
  staff_attitude: "Thái độ nhân viên",
  comfort: "Tiện nghi & thoải mái",
  service_quality: "Chất lượng dịch vụ",
  punctuality: "Đúng giờ",
};

export default function BusEditModal({ open, review, onClose, onSave }: Props) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string>("VISIBLE");
  const [busName, setBusName] = useState<string>("");

  useEffect(() => {
    if (review) {
        setContent(review.review || "");
        setStatus(review.status || "VISIBLE");
        
        if (review.bus_id) {
            busService.getBusById(review.bus_id).then(bus => {
                if (bus && bus.name) {
                    setBusName(bus.name);
                } else {
                    setBusName("");
                }
            });
        }
    }
  }, [review]);

  if (!open || !review) return null;

  const handleSave = () => {
    onSave(review.id, { review: content, status });
    onClose();
  };

  const getUserName = (user?: any) => {
    if (!user) return "Người dùng ẩn danh";
    if (user.last_name && user.first_name) {
        return `${user.last_name} ${user.first_name}`;
    }
    return user.full_name || user.fullName || user.name || user.email || "Người dùng ẩn danh";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white text-gray-800 w-full max-w-lg rounded-xl border border-gray-200 shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh]">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex-shrink-0">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <span className="bg-blue-100 p-1.5 rounded-lg">✏️</span> Chỉnh sửa đánh giá
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="px-6 py-5 space-y-6 text-sm overflow-y-auto custom-scrollbar">

          {/* INFO */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
              <StarIcon className="text-yellow-500" fontSize="small" /> 
              Thông tin chi tiết
            </p>
            <div className="space-y-1.5 text-gray-600">
              <p>Người dùng: <b className="text-gray-900">{getUserName(review.user)}</b></p>
              <p>Mã đặt vé: <b className="text-blue-600 font-mono">{review.booking_id}</b></p>
              <p>Xe: <b className="text-gray-900 font-mono text-xs">
                  {busName ? `${busName} - ` : ""}
                  {review.bus_id && review.bus_id.length > 8 ? `${review.bus_id.substring(0, 8)}...` : review.bus_id}
              </b></p>
              <p>Ngày tạo: <span className="text-gray-500">{new Date(review.created_at).toLocaleString('vi-VN')}</span></p>
            </div>
          </div>

          {/* RATING */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Đánh giá sao</label>
            <div className="flex gap-1 text-2xl p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating
                      ? "text-yellow-400 drop-shadow-sm"
                      : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            
            {/* Detailed Ratings */}
            {review.details && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {Object.entries(review.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                            <span className="text-gray-500">{RATING_LABELS[key] || key}:</span>
                            <span className="font-bold text-gray-700">{value} ★</span>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <p className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
               Nội dung đánh giá
            </p>
            <textarea
              value={content}
              readOnly 
              rows={4}
              className="
                w-full rounded-lg border border-gray-300 bg-gray-50
                px-4 py-3 text-sm text-gray-700
                focus:outline-none cursor-not-allowed
                placeholder-gray-400 shadow-sm
              "
              placeholder="Nội dung đánh giá..."
            />
            <p className="text-xs text-gray-400 mt-1 italic">* Nội dung đánh giá không thể chỉnh sửa để đảm bảo tính minh bạch.</p>
          </div>

          {/* STATUS */}
          <div>
            <p className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
               <BorderColorIcon className="text-purple-500" fontSize="small" /> 
               Trạng thái hiển thị
            </p>
            <div className="flex gap-4 p-1 bg-gray-100/50 rounded-lg">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${status === "VISIBLE" ? "bg-green-50 border-green-200 shadow-sm" : "border-transparent hover:bg-gray-50"}`}>
                <input
                  type="radio"
                  name="status"
                  value="VISIBLE"
                  checked={status === "VISIBLE"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === "VISIBLE" ? "border-green-500" : "border-gray-400"}`}>
                    {status === "VISIBLE" && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                </div>
                <span className={status === "VISIBLE" ? "font-bold text-green-700" : "text-gray-600"}>
                  Hiển thị
                </span>
              </label>

              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${status === "HIDDEN" ? "bg-red-50 border-red-200 shadow-sm" : "border-transparent hover:bg-gray-50 bg-white"}`}>
                <input
                  type="radio"
                  name="status"
                  value="HIDDEN"
                  checked={status === "HIDDEN"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === "HIDDEN" ? "border-red-500" : "border-gray-400"}`}>
                    {status === "HIDDEN" && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                </div>
                <span className={status === "HIDDEN" ? "font-bold text-red-700" : "text-gray-600"}>
                   Ẩn tin
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
          <div className="flex gap-3 ml-auto">
            <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
                Hủy bỏ
            </button>
            <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#1295DB] text-white rounded-lg text-sm font-bold hover:bg-[#0b84c7] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
                <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
