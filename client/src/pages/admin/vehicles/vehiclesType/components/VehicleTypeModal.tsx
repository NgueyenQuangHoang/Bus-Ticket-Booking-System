import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { VehicleType } from "../../../../../services/vehicleTypeService";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleType) => void;
  initialData?: VehicleType | null;
};

export default function VehicleTypeModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState({
    code: "",
    display_name: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    code: "",
    display_name: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code,
        display_name: initialData.display_name,
        description: initialData.description,
      });
    } else {
        setForm({
            code: "",
            display_name: "",
            description: "",
        });
    }
    setErrors({ code: "", display_name: "" });
  }, [initialData, open]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    if (errors[key as keyof typeof errors]) {
        setErrors({ ...errors, [key as keyof typeof errors]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      code: !form.code.trim() ? "Vui lòng nhập mã" : "",
      display_name: !form.display_name.trim() ? "Vui lòng nhập tên hiển thị" : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    if (initialData) {
        onSubmit({ ...form, id: initialData.id } as VehicleType);
    } else {
        const newId = uuidv4();
        onSubmit({ ...form, id: newId } as VehicleType);
    }
    onClose();
  };

  if (!open) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <div
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-lg text-gray-800">
              {initialData ? "Cập nhật loại xe" : "Thêm loại xe mới"}
            </h3>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-200 hover:cursor-pointer"
            >
                <CloseIcon fontSize="small" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã loại xe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="VD: LIMOUSINE"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all
                    ${errors.code ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => handleChange("display_name", e.target.value)}
                placeholder="VD: Limousine Cao Cấp"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all
                    ${errors.display_name ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {errors.display_name && <p className="text-xs text-red-500 mt-1">{errors.display_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Mô tả chi tiết loại xe..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors hover:cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all hover:cursor-pointer"
              >
                {initialData ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
