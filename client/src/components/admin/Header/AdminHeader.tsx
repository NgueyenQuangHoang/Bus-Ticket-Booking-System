import { Menu } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader = ({ onToggleSidebar }: AdminHeaderProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Click ngoài thì đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/auth");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
        >
          <Menu sx={{ fontSize: 24 }} />
        </button>
      </div>

      {/* Right */}
      <div className="relative flex items-center gap-4" ref={ref}>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-700">Admin User</p>
        </div>

        {/* Avatar */}
        <div
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer select-none"
        >
          A
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-44 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-slate-700">
                Admin User
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg hover:cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
