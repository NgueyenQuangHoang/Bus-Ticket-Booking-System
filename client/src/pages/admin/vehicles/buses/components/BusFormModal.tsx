import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BusFormModal({ open, onClose }: Props) {
  if (!open) return null;

  /* ===== STATE ===== */
  const [form, setForm] = useState({
    name: "",
    plate: "",
    company: "",
    status: "ACTIVE",
    type: "",
    layout: "",
    note: "",
    utilities: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: "",
    plate: "",
    company: "",
    type: "",
    layout: "",
  });

  /* ===== HANDLER ===== */
  const handleChange = (
    key: keyof typeof form,
    value: any
  ) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };

  const toggleUtility = (item: string) => {
    setForm((prev) => ({
      ...prev,
      utilities: prev.utilities.includes(item)
        ? prev.utilities.filter((u) => u !== item)
        : [...prev.utilities, item],
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      name: "",
      plate: "",
      company: "",
      type: "",
      layout: "",
    };

    if (!form.name.trim())
      newErrors.name = "Vui lòng nhập tên xe";

    if (!form.plate.trim())
      newErrors.plate = "Vui lòng nhập biển số";

    if (!form.company)
      newErrors.company = "Vui lòng chọn nhà xe";

    if (!form.type)
      newErrors.type = "Vui lòng chọn loại xe";

    if (!form.layout)
      newErrors.layout = "Vui lòng chọn layout ghế";

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    console.log("SUBMIT:", form);
    alert("Lưu xe thành công!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ===== BACKDROP ===== */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* ===== MODAL ===== */}
      <div
        className="
          relative bg-white w-full
          max-h-[90vh] overflow-y-auto

          max-w-[96%]
          [@media(min-width:391px)]:max-w-[680px]
          [@media(min-width:769px)]:max-w-[820px]

          rounded-xl
          border border-gray-200
          shadow-xl
        "
      >
        {/* ===== HEADER ===== */}
        <div className="px-4 py-3 sm:px-5 border-b border-gray-200">
          <h2 className="font-semibold text-base">
            Thêm / Sửa xe
          </h2>
        </div>

        {/* ===== BODY ===== */}
        <div className="px-4 py-4 sm:px-5 space-y-6 text-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===== THÔNG TIN XE ===== */}
            <div className="space-y-4">
              <SectionTitle text="Thông tin xe" />

              <Input
                label="Tên xe"
                value={form.name}
                error={errors.name}
                onChange={(v) =>
                  handleChange("name", v)
                }
              />

              <Input
                label="Biển số"
                value={form.plate}
                error={errors.plate}
                onChange={(v) =>
                  handleChange("plate", v)
                }
              />

              <Select
                label="Nhà xe"
                value={form.company}
                error={errors.company}
                options={[
                  "",
                  "Phương Trang FUTA",
                  "Hoàng Long",
                ]}
                onChange={(v) =>
                  handleChange("company", v)
                }
              />

              <Select
                label="Trạng thái"
                value={form.status}
                options={["ACTIVE", "INACTIVE"]}
                onChange={(v) =>
                  handleChange("status", v)
                }
              />
            </div>

            {/* ===== CẤU HÌNH GHẾ ===== */}
            <div className="space-y-4">
              <SectionTitle text="Cấu hình ghế" />

              <Select
                label="Loại xe"
                value={form.type}
                error={errors.type}
                options={[
                  "",
                  "Giường nằm",
                  "Limousine",
                  "Ghế ngồi",
                ]}
                onChange={(v) =>
                  handleChange("type", v)
                }
              />

              <Select
                label="Layout ghế"
                value={form.layout}
                error={errors.layout}
                options={["", "2-2", "1-2", "2-1"]}
                onChange={(v) =>
                  handleChange("layout", v)
                }
              />

              <Input
                label="Số ghế"
                placeholder="Tự động"
                disabled
              />
            </div>
          </div>

          {/* ===== TIỆN ÍCH ===== */}
          <div>
            <SectionTitle text="Tiện ích" />
            <div className="flex flex-wrap gap-4">
              {["Wifi", "Nước", "TV", "Chăn"].map(
                (item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.utilities.includes(
                        item
                      )}
                      onChange={() =>
                        toggleUtility(item)
                      }
                    />
                    {item}
                  </label>
                )
              )}
            </div>
          </div>

          {/* ===== GHI CHÚ ===== */}
          <div>
            <label className="block mb-1 text-gray-600">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) =>
                handleChange("note", e.target.value)
              }
              placeholder="Ghi chú thêm cho xe"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 px-4 py-3 sm:px-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENT CON ===== */
function SectionTitle({ text }: { text: string }) {
  return (
    <h3 className="font-medium text-gray-700">
      {text}
    </h3>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-600">
        {label}
      </label>
      <input
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
        className={`w-full border rounded px-3 py-2 text-sm
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : error
              ? "border-red-500"
              : "border-gray-300"
          }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-600">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full border rounded px-3 py-2 text-sm
          ${
            error
              ? "border-red-500"
              : "border-gray-300"
          }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "-- Chọn --"}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
