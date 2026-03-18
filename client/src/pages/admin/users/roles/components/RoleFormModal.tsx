import { useState } from "react";
import { Close, KeyboardArrowDown } from "@mui/icons-material";
import type { UserRole } from "../RolesPage";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserRole) => void;
  role?: UserRole | null;
  allUsers: { id: string; userName: string }[];
  availableRoles: { id: string; role_name: string }[];
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSave,
  role,
  allUsers,
  availableRoles,
}: RoleFormModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(role?.id ?? "");
  const [selectedRoleId, setSelectedRoleId] = useState<string>(role?.role_id ?? "");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const isEdit = !!role;

  const selectedUserName = isEdit
    ? role.userName
    : allUsers.find((u) => u.id === selectedUserId)?.userName ?? "";

  const selectedRoleName =
    availableRoles.find((r) => r.id === selectedRoleId)?.role_name ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedRoleId) return;
    onSave({
      id: selectedUserId,
      userName: selectedUserName,
      role: selectedRoleName,
      role_id: selectedRoleId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? "Cập nhật phân quyền user" : "Thêm phân quyền user"}
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
              Người dùng
            </label>
            {isEdit ? (
              <div className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700">
                {role.userName}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-full px-3 py-2 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all flex items-center justify-between bg-white cursor-pointer"
                >
                  <span className={selectedUserName ? "text-slate-900" : "text-slate-400"}>
                    {selectedUserName || "Chọn người dùng"}
                  </span>
                  <KeyboardArrowDown
                    className={`text-slate-400 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-y-auto max-h-48">
                      {allUsers.map((u) => (
                        <li key={u.id}>
                          <button
                            type="button"
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                              selectedUserId === u.id
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-700"
                            } cursor-pointer`}
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setIsUserDropdownOpen(false);
                            }}
                          >
                            {u.userName}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quyền hạn
            </label>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full px-3 py-2 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all flex items-center justify-between bg-white cursor-pointer"
            >
              <span className={selectedRoleName ? "text-slate-900" : "text-slate-400"}>
                {selectedRoleName || "Chọn quyền hạn"}
              </span>
              <KeyboardArrowDown
                className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  {availableRoles.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        className={`w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          selectedRoleId === r.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-slate-700"
                        } cursor-pointer`}
                        onClick={() => {
                          setSelectedRoleId(r.id);
                          setIsRoleDropdownOpen(false);
                        }}
                      >
                        {r.role_name}
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
              disabled={!selectedUserId || !selectedRoleId}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
