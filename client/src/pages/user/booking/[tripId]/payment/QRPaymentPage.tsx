/**
 * Component: QRPaymentPage
 * Mục đích: Trang thanh toán QR (Bước 2 trong quy trình đặt vé).
 * Tính năng:
 *  - Hiển thị mã QR để thanh toán qua ZaloPay.
 *  - Đếm ngược thời gian hết hạn mã QR.
 *  - Sử dụng `BookingTripSummary` cho sidebar.
 */
import { useState, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlaceIcon from "@mui/icons-material/Place";
import type { TripData } from "../Shared/TripInfo";
import BookingTripSummary from "../Shared/BookingTripSummary";

interface QRPaymentPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
  tripData: TripData;
}

export default function QRPaymentPage({ onBack, onSuccess, tripData }: QRPaymentPageProps) {
  // Countdown timer (15 minutes = 900 seconds)
  const [timeLeft, setTimeLeft] = useState(15 * 60 - 5); // Start at 14:55

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs.toString().padStart(2, "0")} giây`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(tripData.ticketCode || "VE1234567890");
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7] pb-8">
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Nút Quay lại */}
        <button
          onClick={onBack}
          className="flex items-center text-sm text-blue-600 font-medium mb-6 hover:underline ml-6 active:scale-95 hover:cursor-pointer"
        >
          <ChevronLeftIcon fontSize="small" className="text-gray-400" />
          Quay lại
        </button>

        {/* Layout Chính: Grid 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái: QR Payment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quét mã QR để thanh toán
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Quý khách hãy quét mã QR bằng ứng dụng{" "}
                <span className="text-blue-600 font-medium">Ngân hàng</span>{" "}
                hoặc{" "}
                <span className="text-blue-600 font-medium">ZaloPay</span> để
                thanh toán đơn đặt vé
              </p>

              {/* QR Code Section */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* QR Code */}
                <div className="flex flex-col items-center w-full md:w-auto">
                  {/* VietQR Image */}
                  <div className="w-64 md:w-56 h-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-2 p-2 shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${tripData.ticketCode || "VE1234567890"}`}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Ngân hàng MB Bank</span>
                </div>

                {/* Payment Info */}
                <div className="flex-1 space-y-4 w-full">
                  {/* Amount */}
                  <div className="text-center md:text-left">
                    <p className="text-gray-600 text-sm">Cần thanh toán</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {tripData.totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                  </div>

                  {/* Timer */}
                  <div className="text-center md:text-left">
                    <p className="text-red-500 text-sm font-medium">
                      Mã QR hết hạn sau {formatTime(timeLeft)}
                    </p>
                  </div>

                  {/* Payment Code */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm text-center mb-2">
                      Mã thanh toán:
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-bold text-blue-600 tracking-wider">
                        {tripData.ticketCode || "VÉ1234567890"}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-1 hover:bg-blue-100 rounded transition-colors hover:cursor-pointer"
                        title="Sao chép"
                      >
                        <ContentCopyIcon
                          fontSize="small"
                          className="text-gray-500"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Fee Note */}
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <PlaceIcon fontSize="small" className="text-orange-500" />
                    <span>Đã bao gồm 5.000đ phí thanh toán</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">1.</span>
                    <span>
                      Quý khách sẽ nhận được{" "}
                      <strong>thông báo khi thanh toán</strong> thành công.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">2.</span>
                    <span>
                      Vexere sẽ gửi vé điện tử qua số điện thoại và email quý
                      khách đã cung cấp.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">3.</span>
                    <span>
                      Nếu gặp khó khăn khi thanh toán, vui lòng gọi{" "}
                      <a
                        href="tel:1900858684"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        1900 85 86 84
                      </a>{" "}
                      để được hỗ trợ.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin chuyến đi using BookingTripSummary */}
          <div className="lg:col-span-5 relative">
            <BookingTripSummary
              trip={tripData}
              actionNode={
                <button
                  onClick={onSuccess}
                  className="w-full py-3 bg-[#ff6b00] hover:bg-[#e55f00] text-white rounded-lg font-bold transition-all active:scale-95 hover:cursor-pointer shadow-sm"
                >
                  Đã thanh toán? Xem Lại đơn đặt vé
                </button>
              }
            />
          </div>
        </div>
      </main>

      {/* Footer Policy Links */}
      <div className="mt-8 text-center text-sm text-black px-4">
        Bằng việc thanh toán, bạn đồng ý với{" "}
        <a
          href="#"
          className="underline hover:text-blue-800 text-blue-600 font-bold"
        >
          Chính sách bảo mật thanh toán
        </a>{" "}
        và{" "}
        <a
          href="#"
          className="underline hover:text-blue-800 text-blue-600 font-bold"
        >
          Quy chế
        </a>
      </div>
    </div>
  );
}
