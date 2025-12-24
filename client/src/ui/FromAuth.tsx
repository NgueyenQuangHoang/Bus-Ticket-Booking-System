import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

// Định nghĩa kiểu dữ liệu cho lỗi form
interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export default function FormAuth({
  changeLoginState,
  setUser,
}: {
  changeLoginState: (login: boolean) => void;
  setUser: (user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Thay thế mảng boolean bằng object chứa message lỗi
  const [errors, setErrors] = useState<FormErrors>({});

  // Regex kiểm tra email
  const emailRegex = /\S+@\S+\.\S+/;

  // Animation States
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Short delay to ensure DOM is present before triggering fade-in
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [open]);

  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};
    const { email, password } = formData;

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    // Trả về true nếu không có key lỗi nào
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: FormErrors = {};
    const { first_name, last_name, email, password, phone } = formData;

    if (!first_name) newErrors.first_name = "Tên không được để trống";
    if (!last_name) newErrors.last_name = "Họ không được để trống";
    if (!phone) newErrors.phone = "Số điện thoại không được để trống";

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Reset lỗi trước khi validate (logic này đã nằm trong hàm validate ở trên vì nó tạo object mới)

    if (isLogin) {
      if (validateLogin()) {
        const response = authService.login({
          email: formData.email,
          password: formData.password,
        });
        response
          .then((res) => {
            if (res !== undefined) {
              changeLoginState(true);
              setUser(res);
              return;
            }
            alert("sai tai khoan mat khau");
          })
          .catch(() => {
            alert("loi server");
          });
      }
    } else {
      if (validateRegister()) {
        const response = authService.register(formData);
        response
          .then((res) => {
            if (res) {
              changeLoginState(true);
              setUser(res);
              alert("dang ky thanh cong");
              return;
            }
            alert("dang ky khong thanh cong");
          })
          .catch(() => {
            alert("loi server");
          });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // UX: Khi người dùng gõ lại, nên xóa lỗi của trường đó đi để họ không khó chịu
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form và lỗi khi chuyển chế độ
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
    });
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <div className="">
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-[#1190D4] px-4 py-2 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors hover:cursor-pointer"
      >
        Đăng nhập
      </button>
      {shouldRender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpen(false)}
          ></div>

          <div
            className={`relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl flex flex-col max-h-[90vh] transition-all duration-300 ease-in-out transform ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="bg-[#1190D4] px-4 py-3 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-medium text-white">
                {isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
              </h3>
              <button
                type="button"
                className="rounded-md bg-white/20 px-3 py-1 text-sm font-semibold text-white hover:bg-white/30 transition-colors hover:cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Đóng
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              {!isLogin && (
                <>
                  <div className="flex gap-2">
                    <div className="flex flex-col w-1/2">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Tên (First Name)"
                        className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                          errors.first_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                        }`}
                      />
                      {errors.first_name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col w-1/2">
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Họ (Last Name)"
                        className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                          errors.last_name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                        }`}
                      />
                      {errors.last_name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Địa chỉ Email"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mật khẩu"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                      }}
                      placeholder="Xác nhận mật khẩu"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {isLogin && (
                <>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mật khẩu"
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full justify-center rounded-md bg-[#1190D4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0e7ebc] transition-colors hover:cursor-pointer"
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
