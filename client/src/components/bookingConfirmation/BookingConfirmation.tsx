/**
 * Component: BookingPage
 * Mục đích: Container chính cho trang Xác nhận đặt vé.
 * Tính năng:
 *  - Điều phối các thành phần con (ContactInfo, TripDetails, Footer).
 *  - Quản lý trạng thái cấp cao (ví dụ: trạng thái hợp lệ toàn cục).
 *  - Bố cục responsive (lưới cho desktop, xếp chồng cho mobile).
 */
import { useState } from "react";
import ContactInfo from "./ContactInfo";
import FooterBookingConfirmation from "./FooterBookingConfirmation";
import TripDetails from "./TripDetails";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function BookingConfirmation() {
  const [isContactValid, setIsContactValid] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f4f7] pb-[10rem]">
      {/* 
            1. Header 
      */}

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* 2. Nút Quay lại */}
        <button className="flex items-center text-sm text-blue-600 font-medium mb-6 hover:underline ml-6 active:scale-95 hover:cursor-pointer">
          <ChevronLeftIcon fontSize="small" className="text-gray-400" />
          Quay lại
        </button>

        {/* 3. Layout Chính: Grid 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Component 1: Thông tin liên hệ */}
            <section>
              <ContactInfo onValidationChange={setIsContactValid} />
            </section>
          </div>

          {/* Cột Phải: Tóm tắt đơn hàng (Chiếm 4 phần) */}
          <div className="lg:col-span-4 relative">
            <TripDetails />
          </div>
        </div>
      </main>
      <FooterBookingConfirmation disabled={!isContactValid} />
    </div>
  );
}
