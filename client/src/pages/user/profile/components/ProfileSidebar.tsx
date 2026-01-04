import { useNavigate, useLocation } from "react-router-dom";

// MUI ICONS
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import RateReviewIcon from "@mui/icons-material/RateReview";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { authService } from "../../../../services/authService";
import Swal from "sweetalert2";

export default function ProfileSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    authService.logout();
    
    Swal.fire({
      title: "Đã đăng xuất",
      text: "Đang chuyển về trang chủ...",
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
      icon: 'success'
    }).then(() => {
       window.location.href = '/'; 
    });
  };

  return (
    <aside className="bg-white rounded p-4 shadow-sm">
      <ul className="space-y-3 text-sm">
        <li
          onClick={() => navigate("/accountProfile")}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            isActive("/accountProfile")
              ? "font-semibold text-[#1295DB]"
              : "text-gray-700 hover:text-[#1295DB]"
          }`}
        >
          <AccountCircleIcon sx={{ fontSize: 20 }} />
          Thông tin tài khoản
        </li>

        <li
          onClick={() => navigate("/my-tickets")}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            isActive("/my-tickets")
              ? "font-semibold text-[#1295DB]"
              : "text-gray-700 hover:text-[#1295DB]"
          }`}
        >
          <ConfirmationNumberIcon sx={{ fontSize: 18 }} />
          Vé của tôi
        </li>

        <li className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1295DB] transition-colors">
          <RateReviewIcon sx={{ fontSize: 18 }} />
          Đánh giá nhà xe
        </li>

        <li className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1295DB] transition-colors">
          <HelpIcon sx={{ fontSize: 18 }} />
          Trung tâm hỗ trợ
          <span className="text-xs text-red-500 ml-1">Mới</span>
        </li>

        <li 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 cursor-pointer hover:text-red-600 transition-colors"
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          Đăng xuất
        </li>
      </ul>
    </aside>
  );
}
