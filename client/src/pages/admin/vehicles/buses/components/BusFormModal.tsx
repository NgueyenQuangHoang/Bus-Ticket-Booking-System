import { useState, useEffect } from "react";
import type { Bus, BusCompany, BusLayout } from "../../../../../types";
import { v4 as uuidv4 } from 'uuid';
import type { VehicleType } from "../../../../../services/vehicleTypeService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Bus>) => void;
  initialData?: Bus | null;
  busCompanies: BusCompany[];
  vehicleTypes: VehicleType[];
  layouts: BusLayout[];
};

export default function BusFormModal({ open, onClose, onSubmit, initialData, busCompanies, vehicleTypes, layouts }: Props) {
  if (!open) return null;

  /* ===== STATE ===== */
  const [form, setForm] = useState({
    name: "",
    plate: "",
    company: "",
    status: "ACTIVE",
    type: "",
    layout: "",
    capacity: 0,
  });

  useEffect(() => {
    if (initialData) {
        setForm({
            name: initialData.name || "",
            plate: initialData.license_plate || "",
            company: initialData.company_id ? String(initialData.company_id) : (initialData.bus_company_id ? String(initialData.bus_company_id) : ""),
            status: initialData.status || "ACTIVE",
            type: initialData.vehicle_type_id ? String(initialData.vehicle_type_id) : "",
            layout: initialData.layout_id ? String(initialData.layout_id) : "",
            capacity: initialData.capacity || 0,
        });
    } else {
        setForm({
            name: "",
            plate: "",
            company: "",
            status: "ACTIVE",
            type: "",
            layout: "",
            capacity: 0,
        });
    }
  }, [initialData, open]);

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
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors({ ...errors, [key]: "" });
  };

  const handleLayoutChange = (layoutId: string) => {
    const selectedLayout = layouts.find(l => String(l.id) === layoutId || String(l.layout_id) === layoutId);
    let calculatedCapacity = 0;
    
    if (selectedLayout) {
        // Calculate capacity: rows * columns * floors
        // Fallback to 0 if properties are missing
        const rows = selectedLayout.total_rows || 0;
        const cols = selectedLayout.total_columns || 0;
        const floors = selectedLayout.floor_count || 1;
        calculatedCapacity = rows * cols * floors;
    }

    setForm(prev => ({ 
        ...prev, 
        layout: layoutId,
        capacity: calculatedCapacity
    }));
    setErrors({ ...errors, layout: "" });
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
    const hasError = Object.values(newErrors).some(Boolean);

    if (!hasError) {
      onSubmit({
        name: form.name,
        license_plate: form.plate,
        company_id: form.company as any, // ID can be string or number
        layout_id: form.layout, 
        vehicle_type_id: form.type,
        capacity: form.capacity,
        status: form.status as any,
        ...(initialData?.id ? { id: initialData.id } : { id: uuidv4() }),
        ...(initialData?.bus_id ? { bus_id: initialData.bus_id } : {})
      });
      onClose();
    }
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
                options={busCompanies.map(c => ({ value: String(c.id || c.bus_company_id), label: c.company_name }))}
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
                options={vehicleTypes.map(v => ({ value: String(v.id), label: v.display_name }))}
                onChange={(v) =>
                  handleChange("type", v)
                }
              />

              <Select
                label="Layout ghế"
                value={form.layout}
                error={errors.layout}
                options={[{value: "", label: "-- Chọn layout --"}, ...layouts.map(l => ({ value: String(l.id || l.layout_id), label: l.layout_name }))]}
                onChange={handleLayoutChange}
              />

              <Input
                label="Số ghế"
                value={String(form.capacity)}
                placeholder="Tự động"
                disabled
              />
            </div>
          </div>


        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 px-4 py-3 sm:px-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:cursor-pointer"
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

type SelectProps = {
  label: string;
  value?: string;
  options: { value: string; label: string }[] | string[];
  onChange: (v: string) => void;
  error?: string;
};

function Select({
  label,
  value,
  options,
  onChange,
  error,
}: SelectProps) {
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
        {options.map((opt) => {
            if (typeof opt === 'string') {
                return (
                    <option key={opt} value={opt}>
                        {opt || "-- Chọn --"}
                    </option>
                );
            }
            return (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            );
        })}
      </select>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
