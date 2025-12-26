import { useState } from "react";
import { Close, KeyboardArrowDown } from "@mui/icons-material";
import type { UserRole } from "../RolesPage";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Omit<UserRole, "id"> | UserRole) => void;
  role?: UserRole | null;
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSave,
  role,
}: RoleFormModalProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<{
    userName: string;
    role: UserRole["role"];
  }>(() => {
    if (role) {
      return {
        userName: role.userName,
        role: role.role,
      };
    }
    return {
      userName: "",
      role: "USER",
    };
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(role && { id: role.id }),
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {role ? "Cập nhật phân quyền user" : "Thêm phân quyền user"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên người dùng
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              placeholder="Nhập tên người dùng..."
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quyền hạn
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all flex items-center justify-between bg-white cursor-pointer"
            >
              <span
                className={formData.role ? "text-slate-900" : "text-slate-400"}
              >
                {formData.role || "Chọn quyền hạn"}
              </span>
              <KeyboardArrowDown
                className={`text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-dropdown-expand">
                  {["USER", "ADMIN", "BUS_COMPANY"].map((role) => (
                    <li key={role}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          formData.role === role
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-slate-700"
                        } hover:cursor-pointer`}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            role: role as UserRole["role"],
                          });
                          setIsDropdownOpen(false);
                        }}
                      >
                        {role}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 cursor-pointer"
            >
              {role ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
