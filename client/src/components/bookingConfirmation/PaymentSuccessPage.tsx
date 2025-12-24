/**
 * Component: PaymentSuccessPage
 * Mục đích: Trang thông báo thanh toán thành công (Bước 3).
 * Tính năng:
 *  - Hiển thị thông báo thành công xanh lá.
 *  - Hiển thị thông tin chuyến đi, hành khách, thanh toán.
 *  - Sử dụng BookingTripSummary cho sidebar.
 */
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { ContactFormData } from "./useContactForm";
import type { TripData } from "./TripInfo";
import BookingTripSummary from "./BookingTripSummary";

interface PaymentSuccessPageProps {
  passengerInfo: ContactFormData;
  tripData: TripData;
  onHome?: () => void;
}

export default function PaymentSuccessPage({
  passengerInfo,
  tripData,
  onHome,
}: PaymentSuccessPageProps) {
  return (
    <div className="min-h-screen bg-[#f2f4f7] pb-12">
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Nút Quay lại (Optional) */}
        <div className="mb-6 ml-6">
            {/* Breadcrumb or Back button could go here */}
        </div>

        {/* --- SUCCESS HEADER --- */}
        <div className="bg-white rounded-t-xl p-8 flex flex-col items-center justify-center text-center border-b border-gray-100 shadow-sm mx-auto max-w-4xl lg:max-w-full">
          <CheckCircleIcon color="success" style={{ fontSize: 64 }} className="mb-4 text-green-500" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Thanh toán thành công
          </h1>
          <p className="text-lg font-medium text-gray-800 mb-1">
            Mã vé: <span className="font-bold">{tripData.ticketCode || "VÉ123456789"}</span>
          </p>
          <p className="text-sm text-gray-500">
            Vé điện tử đã được gửi qua SMS & Email.
          </p>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            
          {/* LEFT COLUMN: INFO CARDS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Thông tin chuyến đi Card (Brief) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin chuyến đi
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 flex gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={tripData.operator.image}
                    alt={tripData.operator.name}
                    className="w-full h-full rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                        {tripData.operator.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">
                        {tripData.operator.vehicleType}
                    </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <EventSeatIcon fontSize="small" className="text-blue-600" />
                  <span>Số ghế: <span className="font-bold">{tripData.operator.seatIds}</span></span>
              </div>
            </div>

            {/* 2. Row: Passenger Info & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Passenger Info */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                        Thông tin hành khách
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <PersonIcon className="text-gray-400" fontSize="small" />
                            <span className="font-medium">{passengerInfo.fullName || "Nguyễn Văn A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <PhoneIcon className="text-gray-400" fontSize="small" />
                            <span>{passengerInfo.phone || "0901 xxx xxx"}</span>
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-700">
                            <EmailIcon className="text-gray-400" fontSize="small" />
                            <span className="truncate">{passengerInfo.email || "email@example.com"}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                        Thông tin thanh toán
                    </h3>
                    <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tổng tiền</span>
                            <span className="font-bold text-gray-900">{tripData.totalPrice.toLocaleString("vi-VN")}đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Phương thức</span>
                            <span className="font-medium text-gray-900">ZaloPay/ QR ngân hàng</span>
                        </div>
                         <div className="flex items-center gap-2 mt-2 bg-green-50 text-green-700 px-3 py-1.5 rounded text-sm font-medium w-fit">
                            <CheckCircleOutlineIcon fontSize="small" />
                            <span>Đã thanh toán</span>
                        </div>
                    </div>
                </div>

            </div>

             {/* Footer Policy Notes */}
             <div className="bg-blue-50/50 rounded-xl p-4 text-xs text-gray-600 space-y-2 border border-blue-100/50">
                <ul className="list-disc pl-5 space-y-1">
                    <li>Vé chỉ có hiệu lực cho chuyến xe đã đặt và không chuyển nhượng.</li>
                    <li>Quý khách cần có mặt tại văn phòng/bến xe trước giờ đi ít nhất 30 phút để làm thủ tục.</li>
                    <li>Hotline hỗ trợ khẩn cấp: <span className="font-bold text-blue-600">1900 88 86 84</span></li>
                </ul>
             </div>

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Trip Timeline Summary used here */}
            <BookingTripSummary trip={tripData} />

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
                <button className="w-full py-3 bg-[#0d63bd] hover:bg-[#0b54a0] text-white rounded-lg font-bold transition-all shadow-sm">
                    Xem vé của tôi
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-bold transition-all shadow-sm">
                        Tải vé PDF
                    </button>
                    <button className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-bold transition-all shadow-sm">
                        Gửi Email
                    </button>
                </div>
                 <button 
                    onClick={onHome}
                    className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-bold transition-all shadow-sm"
                 >
                    Về trang chủ
                </button>
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer Text */}
      <div className="mt-12 text-center text-sm text-gray-500">
        Bằng việc thanh toán, bạn đồng ý với <a href="#" className="underline text-blue-600">Chính sách bảo mật thanh toán</a> và <a href="#" className="underline text-blue-600">Quy chế</a>
      </div>
    </div>
  );
}
