import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import type { Review } from "../../../../../services/reviewService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  ticket: any;
  initialData?: Review; // Existing review for editing
  onDelete?: () => void;
}

const CRITERIA = [
  { key: "safety", label: "An toàn" },
  { key: "info_accuracy", label: "Thông tin chính xác" },
  { key: "info_completeness", label: "Thông tin đầy đủ" },
  { key: "staff_attitude", label: "Thái độ nhân viên" },
  { key: "comfort", label: "Tiện nghi & thoải mái" },
  { key: "service_quality", label: "Chất lượng dịch vụ" },
  { key: "punctuality", label: "Đúng giờ" },
];

export default function ReviewModal({ isOpen, onClose, onSubmit, ticket, initialData, onDelete }: ReviewModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    safety: 5,
    info_accuracy: 5,
    info_completeness: 5,
    staff_attitude: 5,
    comfort: 5,
    service_quality: 5,
    punctuality: 5,
  });

  const [reviewText, setReviewText] = useState("");

  // Effect to populate data when editing
  useEffect(() => {
    if (isOpen && initialData) {
        if (initialData.details) {
            setRatings(initialData.details as Record<string, number>);
        }
        setReviewText(initialData.review || "");
    } else if (isOpen && !initialData) {
        // Reset if creating new
        setRatings({
            safety: 5,
            info_accuracy: 5,
            info_completeness: 5,
            staff_attitude: 5,
            comfort: 5,
            service_quality: 5,
            punctuality: 5,
        });
        setReviewText("");
    }
  }, [isOpen, initialData]);

  const calculateAverage = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const values = Object.values(ratings);
    const avgRating = values.reduce((a, b) => a + b, 0) / values.length;

    const data = {
      bus_id: ticket?.busInfo?.id || "bus_unknown", 
      user_id: "user_current", 
      booking_id: ticket?.id,
      ticket_id: ticket?.id,
      rating: parseFloat(avgRating.toFixed(1)),
      details: ratings,
      review: reviewText,
      created_at: new Date().toISOString(),
      is_verified: true,
    };

    onSubmit(data);
    onClose();
  };

  const currentAverage = calculateAverage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? "Chỉnh sửa đánh giá" : "Viết nhận xét chuyến đi"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
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
            <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} fontSize="medium" className={parseFloat(currentAverage as string) >= star ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                </div>
                <span className="text-lg font-bold text-gray-800">{currentAverage}</span>
            </div>
          </div>

          {/* DETAILED CRITERIA BOX */}
          <div className="border border-gray-200 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Tiêu chí chi tiết</h4>
            <div className="space-y-3">
                {CRITERIA.map((criterion) => (
                <div key={criterion.key} className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm w-1/2">
                    {criterion.label}
                    </span>
                    <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                        key={star}
                        onClick={() => handleRatingChange(criterion.key, star)}
                        className="focus:outline-none transition-transform active:scale-110"
                        type="button"
                        >
                        {ratings[criterion.key] >= star ? (
                            <StarIcon sx={{ fontSize: 20 }} className="text-yellow-400" />
                        ) : (
                            <StarIcon sx={{ fontSize: 20 }} className="text-gray-200" />
                        )}
                        </button>
                    ))}
                    </div>
                </div>
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
            <p className="text-xs text-gray-400 mt-2">
                Gợi ý: viết tối thiểu 10 ký tự để gửi đánh giá.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex gap-2 justify-end">
            {initialData && onDelete && (
                 <button
                    onClick={onDelete}
                    className="px-5 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-semibold text-sm transition-colors mr-auto"
                 >
                    Xoá
                 </button>
            )}
            <button
                onClick={onClose}
                className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors"
            >
                Hủy
            </button>
            <button
                onClick={handleSubmit}
                className="px-5 py-2 text-white bg-[#1295DB] rounded-lg hover:bg-[#0e7dbb] font-semibold text-sm shadow-sm transition-colors"
            >
                Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
