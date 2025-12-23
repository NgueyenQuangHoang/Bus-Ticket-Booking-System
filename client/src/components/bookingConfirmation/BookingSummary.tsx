// src/components/booking/BookingSummary.tsx

/**
 * Component: BookingSummary
 * Mục đích: Hiển thị tóm tắt thông tin đặt vé (Số chuyến, tổng tiền).
 * Ghi chú: Hiện tại chưa được sử dụng hoặc là component cũ trong đợt refactor này.
 */
import { MapPin, Calendar, Bus, Ticket, ChevronRight } from "lucide-react";

export default function BookingSummary() {
  // Dữ liệu giả lập (thực tế sẽ lấy từ Props hoặc Global State/Redux/Context)
  const tripInfo = {
    route: "Sài Gòn - Đà Lạt",
    date: "Thứ 2, 23/12/2025",
    departureTime: "22:30",
    arrivalTime: "05:30",
    departurePlace: "Bến xe Miền Đông",
    arrivalPlace: "Bến xe Liên Tỉnh Đà Lạt",
    busType: "Limousine 34 giường",
    operator: "Nhà xe Phương Trang",
    seats: ["A01", "A02"],
    pricePerTicket: 350000,
  };

  const totalPrice = tripInfo.pricePerTicket * tripInfo.seats.length;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
      {/* Header: Tiêu đề chuyến đi */}
      <div className="bg-[#002559] p-4 text-white">
        <h3 className="text-lg font-bold">Tóm tắt chuyến đi</h3>
        <div className="flex items-center gap-2 text-sm text-blue-100 mt-1">
          <Calendar size={16} />
          <span>{tripInfo.date}</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 1. Lộ trình (Timeline) */}
        <div className="relative pl-2">
          {/* Điểm đi */}
          <div className="flex gap-3 mb-6 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
              {/* Đường kẻ dọc nối 2 điểm */}
              <div className="w-0.5 h-full bg-gray-200 absolute top-3 left-[5px] -z-10"></div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 leading-none">
                {tripInfo.departureTime}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {tripInfo.departurePlace}
              </p>
            </div>
          </div>

          {/* Thời gian di chuyển (Option) */}
          <div className="ml-8 mb-6 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded w-fit">
            ~ 7 giờ di chuyển
          </div>

          {/* Điểm đến */}
          <div className="flex gap-3 relative z-10">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 leading-none">
                {tripInfo.arrivalTime}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {tripInfo.arrivalPlace}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200"></div>

        {/* 2. Thông tin xe & Ghế */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Bus size={18} className="text-blue-600" />
              <span>Nhà xe</span>
            </div>
            <span className="text-sm font-medium text-right text-gray-900">
              {tripInfo.operator}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin size={18} className="text-blue-600" />
              <span>Loại xe</span>
            </div>
            <span className="text-sm font-medium text-right text-gray-900">
              {tripInfo.busType}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Ticket size={18} className="text-blue-600" />
              <span>Số lượng ghế</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">
                {tripInfo.seats.length} vé
              </span>
              <p className="text-xs text-blue-600 font-medium">
                {tripInfo.seats.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200"></div>

        {/* 3. Mã giảm giá (Mô phỏng) */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
          <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
            <Ticket size={18} />
            <span>Mã giảm giá</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>

        {/* 4. Tổng tiền */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-gray-600 font-medium">Tổng tiền</span>
            <span className="text-2xl font-bold text-blue-700">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <p className="text-xs text-right text-gray-400">
            Đã bao gồm thuế và phí
          </p>
        </div>

        {/* Nút Tiếp tục */}
        <button className="w-full bg-[#ffc107] hover:bg-[#ffcd38] text-gray-900 font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform active:scale-95 text-base uppercase">
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
}
