import { useState, useEffect } from "react";
import type { BusCompany } from "../../../../../types/bus";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BusCompany>) => void;
  initialData?: BusCompany | null;
};

type Errors = {
  name: string;
  license: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  description: string;
};

export default function BusCompanyFormModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState({
    name: "",
    license: "",
    phone: "",
    email: "",
    address: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
        setForm({
            name: initialData.company_name || "",
            license: initialData.license_number || "",
            phone: initialData.contact_phone || "",
            email: initialData.contact_email || "",
            address: initialData.address || "",
            status: initialData.status || "",
            description: initialData.description || "",
        });
    } else {
        setForm({
            name: "",
            license: "",
            phone: "",
            email: "",
            address: "",
            status: "",
            description: "",
        });
    }
  }, [initialData, open]);

  const [errors, setErrors] = useState<Errors>({
    name: "",
    license: "",
    phone: "",
    email: "",
    address: "",
    status: "",
    description: "",
  });

  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const handleSubmit = () => {
    const newErrors: Errors = {
      name: "",
      license: "",
      phone: "",
      email: "",
      address: "",
      status: "",
      description: "",
    };

    if (!form.name.trim())
      newErrors.name = "Vui lòng nhập tên nhà xe";

    if (!form.license.trim())
      newErrors.license = "Vui lòng nhập số giấy phép";

    if (!form.phone.trim())
      newErrors.phone = "Vui lòng nhập số điện thoại";

    if (!form.email.trim())
      newErrors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.address.trim())
      newErrors.address = "Vui lòng nhập địa chỉ";

    if (!form.status)
      newErrors.status = "Vui lòng chọn trạng thái";

    if (!form.description.trim())
      newErrors.description = "Vui lòng nhập mô tả";

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(
      (e) => e !== ""
    );

    if (!hasError) {
      onSubmit({
        company_name: form.name,
        license_number: form.license,
        contact_phone: form.phone,
        contact_email: form.email,
        address: form.address,
        status: form.status as any,
        description: form.description,
        ...(initialData?.id ? { id: initialData.id } : { id: uuidv4() }),
        ...(initialData?.bus_company_id ? { bus_company_id: initialData.bus_company_id } : {})
      });
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="
          relative bg-white w-full
          max-w-[92%]
          [@media(min-width:391px)]:max-w-[600px]
          [@media(min-width:769px)]:max-w-[520px]
          rounded-lg border border-gray-200 shadow-lg
        "
      >
        {/* HEADER */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-base">
            Thêm / Sửa nhà xe
          </h2>
        </div>

        {/* BODY */}
        <div className="px-4 py-4 space-y-4 text-sm">
          <h3 className="font-medium text-gray-700 text-sm">
            Thông tin nhà xe
          </h3>

          <div className="grid grid-cols-1 gap-3 [@media(min-width:391px)]:grid-cols-2">
            <Input
              label="Tên nhà xe"
              value={form.name}
              error={errors.name}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="Số giấy phép"
              value={form.license}
              error={errors.license}
              onChange={(v) => handleChange("license", v)}
            />

            <Input
              label="SĐT liên hệ"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => handleChange("phone", v)}
            />

            <Input
              label="Email"
              value={form.email}
              error={errors.email}
              onChange={(v) => handleChange("email", v)}
            />

            <Input
              label="Địa chỉ"
              value={form.address}
              error={errors.address}
              onChange={(v) => handleChange("address", v)}
              className="[@media(min-width:391px)]:col-span-2"
            />

            {/* STATUS */}
            <div>
              <label className="block mb-1 text-gray-600 text-xs">
                Trạng thái
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className={`w-full rounded px-2 py-2 text-sm border
                  ${
                    errors.status
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
              >
                <option value="">-- Chọn --</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 text-gray-600 text-xs">
              Mô tả nhà xe
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              className={`w-full rounded px-2 py-2 text-sm border resize-none
                ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:cursor-pointer">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== INPUT ===== */
function Input({
  label,
  value,
  onChange,
  error,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block mb-1 text-gray-600 text-xs">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded px-2 py-2 text-sm border
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
