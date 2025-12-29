import { useState } from "react";
import {
  Dashboard,
  People,
  LocationOn,
  DirectionsBus,
  EventSeat,
  CalendarToday,
  ConfirmationNumber,
  CreditCard,
  Description,
  Star,
  Image,
  Circle,
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>("users");

  const toggleMenu = (key: string) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  return (
    <div
      className={`w-[260px] h-screen bg-[#0f172a] flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <DirectionsBus className="text-blue-500" sx={{ fontSize: 24 }} />
          <div>
            <h1 className="text-white font-bold text-lg">Bus Admin</h1>
            <p className="text-slate-500 text-xs">Hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <SidebarItem
          icon={Dashboard}
          label="Tổng quan"
          to="/admin/dashboard"
          onClick={() => setOpenMenu(null)}
        />

        <SidebarItem
          icon={People}
          label="Người dùng"
          isOpen={openMenu === "users"}
          onToggle={() => toggleMenu("users")}
          subItems={[
            { label: "Danh sách người dùng", to: "/admin/users" },
            { label: "Quyền hạn", to: "/admin/permissions" },
            { label: "Phân quyền", to: "/admin/roles" },
          ]}
        />

        <SidebarItem
          icon={LocationOn}
          label="Địa điểm & Tuyến"
          isOpen={openMenu === "locations"}
          onToggle={() => toggleMenu("locations")}
          subItems={[
            { label: "Thành phố", to: "/admin/cities" },
            { label: "Bến xe", to: "/admin/stations" },
            { label: "Tuyến đường", to: "/admin/routes" },
          ]}
        />

        <SidebarItem
          icon={DirectionsBus}
          label="Quản lý xe"
          isOpen={openMenu === "bus"}
          onToggle={() => toggleMenu("bus")}
          subItems={[
            { label: "Nhà xe", to: "/admin/bus-companies" },
            { label: "Danh sách xe", to: "/admin/buses" },
            { label: "Hình ảnh xe", to: "/admin/bus-images" },
          ]}
        />

        <SidebarItem
          icon={EventSeat}
          label="Quản lý ghế"
          isOpen={openMenu === "seats"}
          onToggle={() => toggleMenu("seats")}
          subItems={[
            { label: "Loại ghế", to: "/admin/seat-types" },
            { label: "Sơ đồ ghế", to: "/admin/seat-maps" },
            { label: "Mẫu sơ đồ ghế", to: "/admin/seat-templates" },
          ]}
        />

        <SidebarItem
          icon={CalendarToday}
          label="Lịch trình"
          to="/admin/schedules"
          onClick={() => setOpenMenu(null)}
        />

        <SidebarItem
          icon={Circle}
          label="Trạng thái ghế"
          to="/admin/seat-status"
          onClick={() => setOpenMenu(null)}
        />
        {/* Using Circle as placeholder for Seat Status icon if specific one not clear */}

        <SidebarItem
          icon={ConfirmationNumber}
          label="Vé & Hành khách"
          to="/admin/tickets"
          onClick={() => setOpenMenu(null)}
        />

        <SidebarItem
          icon={CreditCard}
          label="Thanh toán"
          isOpen={openMenu === "payment"}
          onToggle={() => toggleMenu("payment")}
          subItems={[
            { label: "Cổng thanh toán", to: "/admin/payment-gateways" },
            { label: "Giao dịch", to: "/admin/transactions" },
          ]}
        />

        <SidebarItem
          icon={Description}
          label="Chính sách hủy"
          to="/admin/cancellation-policies"
          onClick={() => setOpenMenu(null)}
        />

        <SidebarItem
          icon={Star}
          label="Đánh giá"
          to="/admin/reviews"
          onClick={() => setOpenMenu(null)}
        />

        <SidebarItem
          icon={Image}
          label="Banner"
          to="/admin/banners"
          onClick={() => setOpenMenu(null)}
        />
      </div>
    </div>
  );
};

export default Sidebar;
