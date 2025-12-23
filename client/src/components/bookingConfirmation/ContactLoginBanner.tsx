/**
 * Component: ContactLoginBanner
 * Mục đích: Banner nhắc nhở người dùng đăng nhập để tự động điền thông tin.
 */
export default function ContactLoginBanner() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border border-blue-900 rounded-lg p-4 mb-6 gap-4 bg-[#f8faff]">
      <p className="text-sm font-medium text-gray-800 text-center sm:text-left">
        Đăng nhập để tự điền thông tin và nhận điểm khi đặt vé
      </p>
      <button
        type="button"
        className="bg-[#002559] hover:bg-[#003b8e] text-white text-sm font-semibold py-2 px-6 rounded transition-colors whitespace-nowrap shadow-md active:scale-95 hover:cursor-pointer"
      >
        Đăng nhập
      </button>
    </div>
  );
};

;
