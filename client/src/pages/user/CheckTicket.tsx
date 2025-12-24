import React from "react";
import logo1 from "../../assets/datve.png";

export default function CheckTicket() {
  return (
    <section className="bg-white">
      <div className="max-w-[1024px] mx-auto px-3 py-6 [@media(min-width:391px)]:px-4 [@media(min-width:769px)]:px-0">
        <div
          className="
            mt-4
            grid gap-6
            grid-cols-1
            [@media(min-width:391px)]:grid-cols-[280px_1fr]
            [@media(min-width:769px)]:grid-cols-[340px_1fr]
            items-start
          "
        >
          {/* ================= LEFT ================= */}
          <div className="text-center">
            <h2
              className="
                font-bold text-[#0b6fb3]
                text-2xl mb-3
                [@media(min-width:769px)]:text-[26px]
              "
            >
              Nhập thông tin vé xe
            </h2>

            {/* FORM – GIỮ WIDTH 334px (DESKTOP CŨNG OK) */}
            <div className="max-w-[334px] mx-auto w-full">
              <div className="p-4 bg-white rounded">
                <input
                  placeholder="Mã vé"
                  className="w-full border px-3 py-2 text-sm mb-3 rounded"
                />

                <input
                  placeholder="Số điện thoại (Bắt buộc)"
                  className="w-full border px-3 py-2 text-sm mb-4 rounded"
                />

                <button className="w-full bg-[#0b6fb3] text-white py-2 text-sm rounded font-medium">
                  Kiểm tra vé
                </button>

                <div className="bg-gray-100 text-xs text-gray-600 p-3 mt-4 rounded pb-8">
                  <p className="font-semibold mb-1">Lưu ý:</p>
                  <p>
                    Trường hợp bạn không thể hủy vé qua mạng hoặc muốn đổi sang
                    đơn hàng khác vui lòng liên hệ tổng đài{" "}
                    <strong>1900 7070</strong> hoặc{" "}
                    <strong>1900969681</strong>
                  </p>
                </div>

                {/* ===== MOBILE ONLY ===== */}
                <div className="mt-4 [@media(min-width:391px)]:hidden space-y-4">
                  <div className="bg-[#e6f4df] text-[#2e7d32] text-sm px-4 py-2 rounded text-center">
                    Vui lòng nhập vào thông tin và bấm{" "}
                    <strong>kiểm tra vé</strong>
                  </div>

                  <div className="rounded overflow-hidden h-[180px]">
                    <img
                      src={logo1}
                      alt="Đặt vé ngay"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="hidden [@media(min-width:391px)]:block">
            {/* 
              MOBILE + TABLET: max-w 334px
              DESKTOP (lg): GIÃN RỘNG THEO CỘT
            */}
            <div className="max-w-[334px] w-full lg:max-w-none">
              <div className="bg-[#e6f4df] text-[#2e7d32] text-sm p-3 mt-4 rounded text-center">
                Vui lòng nhập vào thông tin và bấm{" "}
                <strong>kiểm tra vé</strong>
              </div>

              <div
                className="
                  rounded overflow-hidden mt-4
                  h-[200px]
                  [@media(min-width:391px)]:h-[260px]
                  [@media(min-width:769px)]:h-[240px]
                "
              >
                <img
                  src={logo1}
                  alt="Đặt vé ngay"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
