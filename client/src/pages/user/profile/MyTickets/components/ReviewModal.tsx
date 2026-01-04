import { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import Swal from "sweetalert2";
import type { Review } from "../../../../../services/reviewService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  ticket: any;
  initialData?: Review; // Existing review for editing
  onDelete?: () => void;
}

export default function ReviewModal({ isOpen, onClose, onSubmit, ticket, initialData, onDelete }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Effect to populate data when editing
  useEffect(() => {
    if (isOpen && initialData) {
        if (initialData.rating) {
            setRating(initialData.rating);
        }
        setReviewText(initialData.review || "");
    } else if (isOpen && !initialData) {
        // Reset if creating new
        setRating(5);
        setReviewText("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const data = {
      bus_id: ticket?.busInfo?.id || "bus_unknown", 
      user_id: "user_current", 
      booking_id: ticket?.id,
      ticket_id: ticket?.id,
      rating: rating,
      review: reviewText,
      created_at: new Date().toISOString(),
      is_verified: true,
    };

    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    const initialRating = initialData?.rating || 5;
    const initialReview = initialData?.review || "";
    
    const isDirty = rating !== initialRating || reviewText !== initialReview;

    if (isDirty) {
      Swal.fire({
        title: "Bạn có chắc chắn muốn hủy?",
        text: "Các thay đổi của bạn sẽ không được lưu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Hủy bỏ thay đổi",
        cancelButtonText: "Tiếp tục chỉnh sửa"
      }).then((result) => {
        if (result.isConfirmed) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? "Chỉnh sửa đánh giá" : "Viết nhận xét chuyến đi"}
          </h3>
          
        </div>

        {/* CONTENT - SCROLLABLE */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TRIP INFO CARD */}
          {ticket && (
             <div className="mb-6 bg-gray-50 border border-gray-100 p-4 rounded-lg flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Chuyến đi</p>
                    <p className="font-bold text-gray-800 text-base">{ticket.busInfo?.route}</p>
                    <p className="text-sm text-gray-600">
                        {ticket.busInfo?.name} • {ticket.busInfo?.time} • {ticket.busInfo?.date}
                    </p>
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-bold whitespace-nowrap">
                    • Đã đi
                </div>
             </div>
          )}

          {/* OVERALL RATING */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Đánh giá tổng quan</h4>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform active:scale-110"
                        type="button"
                    >
                        <StarIcon 
                            fontSize="large" 
                            className={rating >= star ? "text-yellow-400" : "text-gray-200"} 
                        />
                    </button>
                ))}
            </div>
          </div>

          {/* REVIEW TEXT */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Nhận xét của bạn</h4>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[100px]"
              placeholder="Ví dụ: xe chạy êm, đúng giờ, nhân viên nhiệt tình..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex gap-2 justify-between">
            {initialData && onDelete && (
                 <button
                    onClick={onDelete}
                    className="px-5 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-semibold text-sm transition-colors hover:cursor-pointer"
                 >
                    Xoá
                 </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors hover:cursor-pointer"
            >
                Hủy
            </button>
            <button
                onClick={handleSubmit}
                className="px-5 py-2 text-white bg-[#1295DB] rounded-lg hover:bg-[#0e7dbb] font-semibold text-sm shadow-sm transition-colors hover:cursor-pointer"
            >
                Gửi đánh giá
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
