import { useState, useEffect, useMemo } from "react";
import type { Bus, BusCompany, BusLayout } from "../../../../../types";
import { v4 as uuidv4 } from 'uuid';
import type { VehicleType } from "../../../../../services/vehicleTypeService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Bus>, thumbnailFile?: File) => void;
  initialData?: Bus | null;
  busCompanies: BusCompany[];
  vehicleTypes: VehicleType[];
  layouts: BusLayout[];
  isBusCompany?: boolean;
  busCompanyId?: string | number | null;
};

export default function BusFormModal({ open, onClose, onSubmit, initialData, busCompanies, vehicleTypes, layouts, isBusCompany = false, busCompanyId }: Props) {
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

  /* ===== THUMBNAIL STATE ===== */
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();

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
      setThumbnailPreview(initialData.thumbnail_image || "");
    } else {
      const autoCompany = isBusCompany
        ? (busCompanyId ? String(busCompanyId) : (busCompanies[0]?.id ? String(busCompanies[0].id) : ""))
        : "";
      setForm({
        name: "",
        plate: "",
        company: autoCompany,
        status: "ACTIVE",
        type: "",
        layout: "",
        capacity: 0,
      });
      setThumbnailPreview("");
    }
    setThumbnailFile(undefined);
    }, [initialData, open, isBusCompany, busCompanyId, busCompanies]);

  const [errors, setErrors] = useState({
    name: "",
    plate: "",
    company: "",
    type: "",
    layout: "",
  });

  // Layouts that belong to the selected company or are global (admin-created)
  const filteredLayouts = useMemo(() => {
    return layouts.filter((l) => {
      const ownerId = l.bus_company_id ?? l.company_id;
      if (!ownerId) return true; // global layout
      if (!form.company) return false;
      return String(ownerId) === String(form.company);
    });
  }, [layouts, form.company]);

  // Ensure layout stays valid when company changes
  useEffect(() => {
    if (!form.layout) return;
    const stillAllowed = filteredLayouts.some(
      (l) => String(l.id || l.layout_id) === String(form.layout)
    );
    if (!stillAllowed) {
      setForm((prev) => ({ ...prev, layout: "", capacity: 0 }));
    }
  }, [filteredLayouts, form.layout]);

  /* ===== HANDLER ===== */
  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors({ ...errors, [key]: "" });
  };

  const handleLayoutChange = (layoutId: string) => {
    const selectedLayout = filteredLayouts.find(
      (l) => String(l.id) === layoutId || String(l.layout_id) === layoutId
    );
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
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

    const companyValue = form.company || (isBusCompany && busCompanyId ? String(busCompanyId) : "");
    if (!companyValue)
      newErrors.company = "Vui lòng chọn nhà xe";

    if (!form.type)
      newErrors.type = "Vui lòng chọn loại xe";

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);

    if (!hasError) {
      onSubmit({
        name: form.name,
        license_plate: form.plate,
        bus_company_id: companyValue,
        layout_id: form.layout || undefined,
        vehicle_type_id: form.type,
        capacity: form.capacity,
        status: form.status as 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'MAINTENANCE',
        ...(initialData?.id ? { id: initialData.id } : { id: uuidv4() }),
        ...(initialData?.bus_id ? { bus_id: initialData.bus_id } : {})
      }, thumbnailFile);
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
                options={busCompanies.map(c => ({ value: String(c.id || c.bus_company_id), label: c.company_name, }))}
                disabled={isBusCompany}
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
                options={[
                  { value: "", label: "-- Chọn layout --" },
                  ...filteredLayouts.map((l) => ({
                    value: String(l.id || l.layout_id),
                    label: `${l.layout_name} (Hàng: ${l.total_rows || 0}, Cột: ${l.total_columns || 0}, Tầng: ${l.floor_count || 1})`,
                  })),
                ]}
                onChange={handleLayoutChange}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Số hàng"
                  value={
                    form.layout
                      ? String(
                          filteredLayouts.find(
                            (l) =>
                              String(l.id) === form.layout ||
                              String(l.layout_id) === form.layout
                          )?.total_rows || 0
                        )
                      : "Tự động"
                  }
                  disabled
                />

                <Input
                  label="Số cột"
                  value={
                    form.layout
                      ? String(
                          filteredLayouts.find(
                            (l) =>
                              String(l.id) === form.layout ||
                              String(l.layout_id) === form.layout
                          )?.total_columns || 0
                        )
                      : "Tự động"
                  }
                  disabled
                />

                <Input
                  label="Số tầng"
                  value={
                    form.layout
                      ? String(
                          filteredLayouts.find(
                            (l) =>
                              String(l.id) === form.layout ||
                              String(l.layout_id) === form.layout
                          )?.floor_count || 1
                        )
                      : "Tự động"
                  }
                  disabled
                />
              </div>
            </div>
            </div>

            {/* ===== ẢNH ĐẠI DIỆN ===== */}
            <div className="space-y-4">
              <SectionTitle text="Ảnh đại diện" />
              
              <div className="flex items-start gap-4">
                <div className="w-32 h-24 border border-gray-300 rounded overflow-hidden flex items-center justify-center bg-gray-50">
                  {thumbnailPreview ? (
                    <img 
                      src={thumbnailPreview} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa có ảnh</span>
                  )}
                </div>
                <div>
                  <label className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded cursor-pointer hover:bg-blue-100 transition text-sm font-medium">
                    Chọn ảnh
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      onChange={handleThumbnailChange}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Chọn ảnh đại diện cho xe. 
                    Ảnh này sẽ hiển thị ở trang chủ.
                  </p>
                </div>
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
  disabled?: boolean;
};

function Select({
  label,
  value,
  options,
  onChange,
  error,
  disabled,
}: SelectProps) {
  return (
    <div>
      <label className="block mb-1 text-gray-600">
        {label}
      </label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full border rounded px-3 py-2 text-sm
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : error
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
