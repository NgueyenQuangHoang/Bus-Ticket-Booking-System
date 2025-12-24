/**
 * Component: PriceSummary
 * Mục đích: Hiển thị chi tiết giá vé.
 * Ghi chú: Trước đây dùng trong TripDetails, hiện tại có thể dùng ở chỗ khác hoặc là legacy.
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PriceSummary() {
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm select-none">
      {/* Header Tạm tính */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsPriceExpanded(!isPriceExpanded)}
      >
        <span className="text-lg font-bold text-gray-900">Tạm tính</span>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-gray-900 ">300.000đ</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isPriceExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Nội dung xổ xuống */}
      {isPriceExpanded && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="pt-2 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-start mt-3">
              <span className="text-sm text-gray-600">Giá vé</span>
              <div className="text-right">
                <span className="block text-sm font-bold text-gray-900">
                  300.000đ x 1
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Mã ghế/giường: A1-2
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
