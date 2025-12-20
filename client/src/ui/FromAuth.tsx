import { useState } from "react";

export default function FormAuth() {
  const [open, setOpen] = useState(false);

  // 1. State để kiểm tra đang ở chế độ Đăng nhập hay Đăng ký
  const [isLogin, setIsLogin] = useState(true);

  // 2. State lưu dữ liệu form (theo đúng type User bạn đưa)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Hàm xử lý khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý submit (giả lập)
  const handleSubmit = () => {
    if (isLogin) {
      console.log("Đang đăng nhập với:", {
        email: formData.email, // Hoặc phone
        password: formData.password,
      });
      // Gọi API login ở đây
    } else {
      console.log("Đang đăng ký user mới:", formData);
      // Gọi API register ở đây
      // Data gửi đi sẽ bao gồm: first_name, last_name, email, password, phone
    }
    // Sau khi thành công thì đóng modal
    // setOpen(false);
  };

  // Hàm reset form khi chuyển đổi chế độ
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
    });
  };

  return (
    <div className="">
      {/* --- BUTTON MỞ MODAL --- */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-[#1190D4] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
      >
        Đăng nhập
      </button>

      {/* --- MODAL --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setOpen(false)}
          ></div>

          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl transition-all flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1190D4] px-4 py-3 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-medium text-white">
                {isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
              </h3>
              <button
                type="button"
                className="rounded-md bg-white/20 px-3 py-1 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>

            {/* Body (Có thanh cuộn nếu nội dung dài) */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              {/* === FORM ĐĂNG KÝ (Hiện thêm các trường) === */}
              {!isLogin && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Tên (First Name)"
                      className="w-1/2 border-gray-300 border rounded-md p-2.5 focus:outline-none focus:border-[#1190D4] focus:ring-1 focus:ring-[#1190D4]"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Họ (Last Name)"
                      className="w-1/2 border-gray-300 border rounded-md p-2.5 focus:outline-none focus:border-[#1190D4] focus:ring-1 focus:ring-[#1190D4]"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="border-gray-300 border rounded-md p-2.5 focus:outline-none focus:border-[#1190D4] focus:ring-1 focus:ring-[#1190D4]"
                  />
                </>
              )}

              {/* === CÁC TRƯỜNG CHUNG (Email & Password) === */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  isLogin ? "Email hoặc số điện thoại" : "Địa chỉ Email"
                }
                className="border-gray-300 border rounded-md p-2.5 focus:outline-none focus:border-[#1190D4] focus:ring-1 focus:ring-[#1190D4]"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="border-gray-300 border rounded-md p-2.5 focus:outline-none focus:border-[#1190D4] focus:ring-1 focus:ring-[#1190D4]"
              />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full justify-center rounded-md bg-[#1190D4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0e7ebc] transition-colors"
              >
                {isLogin ? "Đăng nhập" : "Đăng ký ngay"}
              </button>

              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <p>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</p>
                <button
                  type="button"
                  className="font-semibold text-[#1190D4] hover:underline hover:cursor-pointer"
                  onClick={toggleMode}
                >
                  {isLogin ? "Đăng ký" : "Đăng nhập"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
