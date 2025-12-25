import React, { useState } from "react";

// MUI ICONS
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";

type Gender = "nam" | "nu" | "khac";

export default function AccountProfile() {
  const [gender, setGender] = useState<Gender>("nam");

  const [name, setName] = useState("");
  const [phone] = useState("0349***"); // KHÓA SỐ ĐIỆN THOẠI
  const [birthday, setBirthday] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    birthday: "",
  });

  const handleSave = () => {
    const newErrors = {
      name: "",
      birthday: "",
    };

    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (!birthday) {
      newErrors.birthday = "Vui lòng chọn ngày sinh";
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.birthday) {
      console.log({ name, phone, birthday, gender });
      alert("Lưu thông tin thành công!");
    }
  };

  return (
    <section className="bg-[#f5f7fa]">
      <div
        className="
          max-w-[1024px] mx-auto
          px-3 py-6
          [@media(min-width:391px)]:px-4
          [@media(min-width:769px)]:px-0
        "
      >
        <div
          className="
            grid gap-6
            grid-cols-1
            [@media(min-width:391px)]:grid-cols-[260px_1fr]
            items-start
          "
        >
          {/* SIDEBAR */}
          <aside className="bg-white rounded p-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 font-semibold text-[#1295DB]">
                <AccountCircleIcon sx={{ fontSize: 20 }} />
                Thông tin tài khoản
              </li>

              <li className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <AddShoppingCartIcon sx={{ fontSize: 18 }} />
                Đơn hàng của tôi
              </li>

              <li className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <RateReviewIcon sx={{ fontSize: 18 }} />
                Đánh giá nhà xe
              </li>

              <li className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <HelpIcon sx={{ fontSize: 18 }} />
                Trung tâm hỗ trợ
                <span className="text-xs text-red-500 ml-1">Mới</span>
              </li>

              <li className="flex items-center gap-2 text-red-500 cursor-pointer">
                <LogoutIcon sx={{ fontSize: 18 }} />
                Đăng xuất
              </li>
            </ul>
          </aside>

          {/* CONTENT */}
          <div className="bg-white rounded p-6">
            {/* TITLE WITH ICON */}
            <h2 className="flex items-center gap-2 font-semibold text-base mb-4 text-[#1295DB]">
              <AccountCircleIcon sx={{ fontSize: 22 }} />
              Thông tin tài khoản
            </h2>

            <div className="space-y-4 text-sm">
              {/* NAME */}
              <div>
                <label className="block mb-1 text-gray-600">Họ và tên</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Nhập họ và tên"
                  className={`w-full border px-3 py-2 rounded
                    ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* PHONE – READ ONLY */}
              <div>
                <label className="block mb-1 text-gray-600">
                  Số điện thoại
                </label>
                <input
                  value={phone}
                  readOnly
                  className="w-full border px-3 py-2 rounded
                    border-gray-300 bg-gray-100
                    cursor-not-allowed text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Số điện thoại không thể thay đổi
                </p>
              </div>

              {/* BIRTHDAY */}
              <div>
                <label className="block mb-1 text-gray-600">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    setErrors({ ...errors, birthday: "" });
                  }}
                  className={`w-full border px-3 py-2 rounded
                    ${
                      errors.birthday
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                />
                {errors.birthday && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.birthday}
                  </p>
                )}
              </div>

              {/* GENDER */}
              <div>
                <label className="block mb-2 text-gray-600">
                  Giới tính
                </label>
                <div className="grid grid-cols-3 border rounded overflow-hidden divide-x border-gray-300">
                  {[
                    { key: "nam", label: "Nam" },
                    { key: "nu", label: "Nữ" },
                    { key: "khac", label: "Khác" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setGender(item.key as Gender)
                      }
                      className={`py-2 transition
                        ${
                          gender === item.key
                            ? "bg-[#1295DB] text-white"
                            : "bg-white text-gray-600"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SAVE */}
              <button
                onClick={handleSave}
                className="w-full bg-[#1295DB] text-white py-2 rounded mt-6 font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
