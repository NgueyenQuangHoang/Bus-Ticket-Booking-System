/**
 * Component: ContactInfo
 * Mục đích: Form nhập thông tin liên hệ (Tên, SĐT, Email).
 * Tính năng:
 *  - Sử dụng hook `useContactForm` để xử lý logic và validation.
 *  - Hiển thị banner đăng nhập.
 *  - Bố cục responsive.
 */
import { useContactForm, type ContactFormData } from "./useContactForm";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { green } from "@mui/material/colors";
import AreaCodeSelect from "./AreaCodeSelect";
import ContactLoginBanner from "./ContactLoginBanner";
import type { User } from "../../../../../types";
import { useEffect } from "react";

interface ContactInfoProps {
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: ContactFormData) => void;
  changeLoginState: (login: boolean) => void;
  setUser: (user: User) => void;
  notify: (notifycation: string, status: boolean) => void;
  user?: User | null;
}

export default function ContactInfo({ onValidationChange, onDataChange, changeLoginState, setUser, notify, user }: ContactInfoProps) {
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleCountryCodeChange,
    validate,
    setFormData,
  } = useContactForm(onValidationChange, onDataChange);

  // Auto-fill when user login
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.first_name + " " + user.last_name,
        phone: user.phone || "",
        email: user.email || ""
      }));
    }
  }, [user, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form valid:", formData);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* 1. Phần Đăng nhập */}
      {!user && <ContactLoginBanner changeLoginState={changeLoginState} setUser={setUser} notify={notify} />}

      {/* 2. Tiêu đề */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Thông tin liên hệ
      </h2>

      {/* 
          3. Form nhập liệu 
      */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 
            Input: Tên người đi 
        */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700">
            Tên người đi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur("fullName")}
            placeholder="Nhập họ tên người đi"
            className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 transition-colors ${errors.fullName && touched.fullName
              ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
              }`}
          />
          {errors.fullName && touched.fullName && (
            <span className="text-xs text-red-500">{errors.fullName}</span>
          )}
        </div>

        {/* 
            Phần Số điện thoại (Custom Layout) 
        */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {/* Mã vùng */}
            <AreaCodeSelect
              value={formData.countryCode}
              onChange={handleCountryCodeChange}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur("phone")}
              placeholder="Nhập số điện thoại"
              className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 transition-colors ${errors.phone && touched.phone
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
                }`}
            />
          </div>
          {errors.phone && touched.phone && (
            <span className="text-xs text-red-500">{errors.phone}</span>
          )}
        </div>

        {/* 
            Input: Email 
        */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700">
            Email để nhận thông tin đặt chỗ{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            placeholder="Nhập email của bạn"
            className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-1 transition-colors ${errors.email && touched.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:border-[#1190D4] focus:ring-[#1190D4]"
              }`}
          />
          {errors.email && touched.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        {/* 4. Thông báo tin cậy */}
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <VerifiedUserIcon sx={{ color: green[500] }} fontSize="small" />
          <p className="text-sm text-gray-700">
            Thông tin đặt vé sẽ được gửi đến số điện thoại và email bạn cung
            cấp.
          </p>
        </div>
      </form>
    </div>
  );
}
