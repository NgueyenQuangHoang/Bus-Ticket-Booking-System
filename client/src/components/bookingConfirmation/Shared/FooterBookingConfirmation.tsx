/**
 * Component: FooterBookingConfirmation
 * Mục đích: Footer cố định cho trang Xác nhận đặt vé.
 * Tính năng:
 *  - Nút "Tiếp tục" với trạng thái disabled.
 *  - Thông tin giải thích các bước tiếp theo.
 *  - Liên kết đến Điều khoản & Chính sách (bố cục responsive).
 */
interface FooterProps {
  disabled?: boolean;
  onContinue?: () => void;
}

export default function FooterBookingConfirmation({
  disabled = false,
  onContinue,
}: FooterProps) {
  const handleClick = () => {
    if (!disabled && onContinue) {
      onContinue();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 ">
      <div className="flex flex-col p-3">
        {/* Hàng 1: Tổng tiền & Nút toggle */}
        <div className="flex items-center justify-between cursor-pointer mb-3">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-[#0060c4]">
              {/* {totalPrice.toLocaleString("vi-VN")}đ */}
            </span>
          </div>
        </div>

        {/* Hàng 2: Nút Tiếp tục (Button Action) */}
        {/* Button này thường đi kèm ở Bottom Bar trên Mobile */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-10">
          <button
            disabled={disabled}
            onClick={handleClick}
            className={`w-full lg:w-[42rem] py-3 rounded-lg uppercase shadow-sm font-bold transition-all hover:cursor-pointer ${
              disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#ffc107] hover:bg-[#ffcd38] text-gray-900 active:scale-95"
            }`}
          >
            Tiếp tục
          </button>
          <p className="w-full lg:w-[340px] text-[14px] text-gray-600 text-center lg:text-left">
            Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng
            thay đổi điểm đón trả sau khi đặt.
          </p>
        </div>
        <div className="mt-4 text-center text-sm text-black px-2">
          Bằng việc tiếp tục, bạn đồng ý với{" "}
          <a
            href="#"
            className="underline hover:text-blue-800 text-blue-600 font-bold active:scale-95"
          >
            Quy chế hoạt động
          </a>{" "}
          và{" "}
          <a
            href="#"
            className="underline hover:text-blue-800 text-blue-600 font-bold active:scale-95"
          >
            Chính sách bảo mật
          </a>
        </div>
      </div>
    </div>
  );
}
