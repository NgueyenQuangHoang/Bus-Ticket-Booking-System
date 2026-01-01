import React from "react";
import StarIcon from '@mui/icons-material/Star';
import BorderColorIcon from '@mui/icons-material/BorderColor';
type Review = {
  id: number;
  user: string;
  bus: string;
  rating: number;
  content: string;
  status: "VISIBLE" | "HIDDEN";
};

interface Props {
  open: boolean;
  review: Review | null;
  onClose: () => void;
}

export default function EditReviewModal({ open, review, onClose }: Props) {
  if (!open || !review) return null;

  return (
    <div className="hidden sm:flex fixed inset-0 z-50 items-center justify-center bg-black/30">
      <div className="bg-white text-gray-800 w-[620px] rounded-xl border border-gray-200 shadow-xl">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-base flex items-center gap-2">
            ✏️ Chỉnh sửa đánh giá
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="px-6 py-5 space-y-6 text-sm">

          {/* INFO */}
          <div>
            <p className="font-semibold mb-2 text-gray-600">
              <StarIcon
                className="text-yellow-400"
                fontSize="small"
              /> Thông tin đánh giá (chỉ xem)
            </p>
            <div className="space-y-1">
              <p>Người dùng: <b>{review.user}</b></p>
              <p>Xe: <b className="text-blue-600">{review.bus}</b></p>
              <p>Mã đánh giá: <b className="text-red-500">#{review.id}</b></p>
              <p>Ngày tạo: <b className="text-gray-500">12/03/2025 14:30</b></p>
            </div>
          </div>

          {/* RATING */}
          <div>
            <StarIcon
              className="text-yellow-400"
              fontSize="small"
            />
            <div className="flex gap-1 text-lg">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div>
            <p className="font-semibold mb-2 text-gray-600">
              Nội dung đánh giá
            </p>
            <textarea
              defaultValue={review.content}
              rows={3}
              className="
                w-full rounded-lg border border-gray-300
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </div>

          {/* STATUS */}
          <div>
            <p className="font-semibold mb-2 text-gray-600">
              <BorderColorIcon className="text-red-400"
                fontSize="small" /> Trạng thái hiển thị
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  defaultChecked={review.status === "VISIBLE"}
                />
                <span className="text-green-600">
                  Hiển thị cho người dùng
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  defaultChecked={review.status === "HIDDEN"}
                />
                <span className="text-yellow-600">
                  Ẩn đánh giá
                </span>
              </label>
            </div>
          </div>

          {/* REASON */}
          <div>
            <p className="font-semibold mb-2 text-gray-600">
              ⛔ Lý do ẩn (chỉ hiện khi chọn HIDDEN)
            </p>
            <input
              placeholder="Ngôn từ không phù hợp / đang kiểm duyệt"
              className="
                w-full rounded-lg border border-gray-300
                px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-red-300
              "
            />
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
          >
            Hủy
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
             Lưu
          </button>
        </div>

      </div>
    </div>
  );
}
