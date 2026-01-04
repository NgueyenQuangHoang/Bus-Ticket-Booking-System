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
import { getStoredRole } from "../../../utils/authStorage";
import type { RoleName } from "../../../utils/roleAccess";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const userRole = getStoredRole() as RoleName | null;

  const navItems = [
    {
      key: "dashboard",
      icon: Dashboard,
      label: "Tổng quan",
      to: "/admin/dashboard",
      roles: ["ADMIN"],
    },
    {
      key: "bus-company-dashboard",
      icon: Dashboard,
      label: "Dashboard nhà xe",
      to: "/bus-company",
      roles: ["BUS_COMPANY"],
    },
    {
      key: "users",
      icon: People,
      label: "Người dùng",
      roles: ["ADMIN"],
      subItems: [
        { label: "Danh sách người dùng", to: "/admin/users", roles: ["ADMIN"] },
        { label: "Quyền hạn", to: "/admin/permissions", roles: ["ADMIN"] },
        { label: "Phân quyền", to: "/admin/roles", roles: ["ADMIN"] },
      ],
    },
    {
      key: "locations",
      icon: LocationOn,
      label: "Địa điểm & Tuyến",
      roles: ["ADMIN"],
      subItems: [
        { label: "Thành phố", to: "/admin/cities", roles: ["ADMIN"] },
        { label: "Bến xe", to: "/admin/stations", roles: ["ADMIN"] },
        { label: "Tuyến đường", to: "/admin/routes", roles: ["ADMIN"] },
      ],
    },
    {
      key: "bus",
      icon: DirectionsBus,
      label: "Quản lý xe",
      roles: ["ADMIN", "BUS_COMPANY"],
      subItems: [
        { label: "Loại xe", to: "/admin/vehicles-types", roles: ["ADMIN"] },
        { label: "Nhà xe", to: "/admin/bus-companies", roles: ["ADMIN"] },
        { label: "Danh sách xe", to: "/admin/buses", roles: ["ADMIN", "BUS_COMPANY"] },
        { label: "Hình ảnh xe", to: "/admin/bus-images", roles: ["ADMIN", "BUS_COMPANY"] },
      ],
    },
    {
      key: "seats",
      icon: EventSeat,
      label: "Quản lý ghế",
      roles: ["ADMIN", "BUS_COMPANY"],
      subItems: [
        { label: "Loại ghế", to: "/admin/seat-types", roles: ["ADMIN"] },
        { label: "Sơ đồ ghế", to: "/admin/seat-maps", roles: ["ADMIN", "BUS_COMPANY"] },
        { label: "Mẫu sơ đồ ghế", to: "/admin/seat-templates", roles: ["ADMIN", "BUS_COMPANY"] },
      ],
    },
    {
      key: "schedules",
      icon: CalendarToday,
      label: "Lịch trình",
      to: "/admin/schedules",
      roles: ["ADMIN", "BUS_COMPANY"],
    },
    {
      key: "seat-status",
      icon: Circle,
      label: "Trạng thái ghế",
      to: "/admin/seat-status",
      roles: ["ADMIN", "BUS_COMPANY"],
    },
    {
      key: "tickets",
      icon: ConfirmationNumber,
      label: "Vé & Hành khách",
      to: "/admin/tickets",
      roles: ["ADMIN", "BUS_COMPANY"],
    },
    {
      key: "payment",
      icon: CreditCard,
      label: "Thanh toán",
      roles: ["ADMIN"],
      subItems: [
        { label: "Cổng thanh toán", to: "/admin/payment-gateways", roles: ["ADMIN"] },
        { label: "Giao dịch", to: "/admin/transactions", roles: ["ADMIN"] },
      ],
    },
    {
      key: "cancellation",
      icon: Description,
      label: "Chính sách hủy",
      to: "/admin/cancellation-policies",
      roles: ["ADMIN"],
    },
    {
      key: "reviews",
      icon: Star,
      label: "Đánh giá",
      to: "/admin/reviews",
      roles: ["ADMIN", "BUS_COMPANY"],
    },
    {
      key: "banners",
      icon: Image,
      label: "Banner",
      to: "/admin/banners",
      roles: ["ADMIN"],
    },
  ];

  const filteredNavItems = navItems
    .map((item) => {
      if (!userRole || (item.roles && !item.roles.includes(userRole))) {
        return null;
      }
      if (!item.subItems) {
        return item;
      }
      const subItems = item.subItems.filter(
        (subItem) => !subItem.roles || subItem.roles.includes(userRole)
      );
      if (subItems.length === 0) return null;
      return { ...item, subItems };
    })
    .filter((item): item is (typeof navItems)[number] => item !== null);

  const initialOpenMenu = filteredNavItems.find((item) => item.subItems)?.key ?? null;
  const [openMenu, setOpenMenu] = useState<string | null>(initialOpenMenu);

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
        {filteredNavItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isOpen={openMenu === item.key}
            onToggle={item.subItems ? () => toggleMenu(item.key) : undefined}
            onClick={item.subItems ? undefined : () => setOpenMenu(null)}
            subItems={item.subItems?.map((sub) => ({ label: sub.label, to: sub.to }))}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
