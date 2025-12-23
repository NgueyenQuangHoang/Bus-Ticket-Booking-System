/**
 * Component: TripDetailModal
 * Mục đích: Drawer (hoặc modal) hiển thị thông tin chi tiết chuyến đi.
 * Tính năng:
 *  - Animation: Trượt từ phải sang.
 *  - Nội dung: Nhà xe, Lộ trình, Lịch trình, Điểm đón/trả.
 *  - Thao tác: Đóng, Đổi chuyến.
 */
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdjustIcon from "@mui/icons-material/Adjust"; // For Pickup
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Dropoff
import type { TripData } from "./TripInfo";

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
}

export default function TripDetailModal({
  isOpen,
  onClose,
  trip,
}: TripDetailModalProps) {
  const [shouldRender, setShouldRender] = useState(true);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const isDeparture = trip.type === "departure";
  const badgeText = isDeparture
    ? "CHIỀU ĐI"
    : trip.type === "return"
    ? "CHIỀU VỀ"
    : "";

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Header */}
        <div className="bg-[#2474E5] text-white p-4 flex items-center gap-4 shrink-0">
          <div
            className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors"
            onClick={onClose}
          >
            <ArrowBackIcon fontSize="medium" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-snug">
              {trip.operator.name}
            </h3>
            <div className="flex items-center gap-2 text-sm mt-0.5 opacity-95">
              {badgeText && (
                <span className="text-[#85b9ff] font-bold uppercase text-xs">
                  {badgeText}
                </span>
              )}
              {badgeText && <span className="opacity-60">•</span>}
              <span>
                {trip.departure.time} • {trip.dateStr}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 custom-scrollbar bg-white">
          {/* Info Rows */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-500">Tuyến</span>
              <span className="text-gray-900 font-medium text-right">
                {trip.route || "Sài Gòn - Nha Trang"}
              </span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-500">Nhà xe</span>
              <span className="text-gray-900 font-medium text-right">
                {trip.operator.name}
              </span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-500">Chuyến</span>
              <span className="text-gray-900 font-medium text-right">
                {trip.departure.time} • {trip.dateStr}
              </span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-500">Loại xe</span>
              <span className="text-gray-900 font-medium text-right">
                {trip.operator.vehicleType}
              </span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-500">Số lượng</span>
              <span className="text-gray-900 font-medium text-right">
                {trip.operator.passengerCount} vé
              </span>
            </div>

            {/* Expandable Rows Mock */}
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-500">Mã ghế/ giường</span>
              <div className="flex items-center gap-1 cursor-pointer select-none">
                <span className="text-gray-900 font-bold">
                  {trip.operator.seatIds}
                </span>
                <KeyboardArrowDownIcon
                  className="text-gray-400"
                  fontSize="small"
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tạm tính</span>
              <div className="flex items-center gap-1 cursor-pointer select-none">
                <span className="text-gray-900 font-bold">
                  {trip.price || "320.000đ"}
                </span>
                <KeyboardArrowDownIcon
                  className="text-gray-400"
                  fontSize="small"
                />
              </div>
            </div>
          </div>

          {/* Points Timeline */}
          <div className="space-y-6 pt-2">
            {/* Pickup Point */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AdjustIcon
                    className="text-[#2474E5]"
                    style={{ fontSize: 20 }}
                  />
                  <span className="font-bold text-gray-900">Điểm đón</span>
                </div>
                <button className="text-[#2474E5] text-sm underline font-medium hover:text-blue-800">
                  Thay đổi
                </button>
              </div>
              <div className="pl-[29px] relative">
                {/* Connecting line */}
                <div className="absolute left-[9px] -top-1 bottom-[-24px] w-[1px] bg-gray-200 -z-10"></div>

                <p className="text-sm font-medium text-gray-900">
                  {trip.departure.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {trip.departure.address}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Dự kiến đón lúc:{" "}
                  <span className="text-gray-600">
                    {trip.departure.time} {trip.dateStr.split(", ")[1]}
                  </span>
                </p>
              </div>
            </div>

            {/* Dropoff Point */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LocationOnIcon
                    className="text-red-500"
                    style={{ fontSize: 20 }}
                  />
                  <span className="font-bold text-gray-900">Điểm trả</span>
                </div>
                <button className="text-[#2474E5] text-sm underline font-medium hover:text-blue-800">
                  Thay đổi
                </button>
              </div>
              <div className="pl-[29px]">
                <p className="text-sm font-medium text-gray-900">
                  {trip.arrival.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {trip.arrival.address}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Dự kiến trả lúc:{" "}
                  <span className="text-gray-600">
                    {trip.arrival.time} {trip.dateStr.split(", ")[1]}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
          <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded text-sm transition-colors uppercase hover:cursor-pointer">
            Đổi chuyến
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#FFC700] hover:bg-[#e6b400] text-black font-bold py-2.5 rounded text-sm transition-colors uppercase hover:cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
