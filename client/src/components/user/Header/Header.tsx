import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoMain from "../../../assets/loginmain.png";
import FormAuth from "../AuthModal/FromAuth";
import AvatarLogin from "../../../pages/user/home/components/AvatarLogin";
import type { User } from "../../../types";
import toast, { Toaster } from "react-hot-toast";

export default function Header() {
  const notify = (notifycation: string, status: boolean) => {
    if (status) {
      toast.success(notifycation);
    }
    else {
      toast.error(notifycation)
    }
  }

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin') as string) : false
  );
  const [user, setUser] = useState<User | undefined>(
    () => {
      const get = localStorage.getItem('user')
      return get ? JSON.parse(get) : undefined
    }
  )

  // Desktop nav item style
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-[#1190D4] text-white h-[41px] px-[14px] rounded-[7px] flex items-center font-bold text-[14px] uppercase tracking-[0.28px] whitespace-nowrap"
      : "h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors whitespace-nowrap";

  return (
    <header className="w-full font-['Segoe_UI']">
      {/* ================= TOP BAR (LUÔN HIỆN) ================= */}
      <div className="bg-[#1295db] text-white h-[30px] flex items-center">
        <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-[170px] text-[11px] sm:text-[12px]">
          {/* Left (luôn có) */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0">🚌</span>
            <span className="font-normal truncate">
              Hệ thống Đặt Vé Xe Toàn Quốc
            </span>
          </div>

          {/* Right (chỉ hiện Desktop >= 769px) */}
          <div className="hidden md:flex items-center gap-6 opacity-70">
            <div className="flex items-center gap-1 pr-3 border-r border-white/50 h-[16px]">
              <span>✉</span>
              <span>info.vivutoday@gmail.com</span>
            </div>
            <div className="flex items-center gap-1 pl-3">
              <span>📞</span>
              <span>1900 0152</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <div className="bg-white shadow-sm relative z-20 h-[60px] flex items-center">
        <div className="w-full flex items-center px-3 sm:px-4 md:px-8 lg:px-[170px] min-w-0">

          {/* Mobile + Tablet: Hamburger (<=768px) */}
          <div className="md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 flex items-center justify-center rounded text-[#1295db] hover:bg-sky-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Logo:
              - Mobile/Tablet: đẩy sang phải (ml-auto)
              - Desktop: về bình thường (md:ml-0) */}
          <div className="w-[110px] h-[60px] flex items-center justify-center ml-auto md:ml-0">
            <img
              src={logoMain}
              alt="Vivu Today"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Desktop nav (>=769px) */}
          <nav className="hidden md:flex items-center gap-[12px] flex-1 ml-[32px] min-w-0 overflow-hidden">

            <NavLink to="/" className={navClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/about-page" className={navClass}>
              Giới thiệu
            </NavLink>
            <NavLink to="/busCompany" className={navClass}>
              Thông tin nhà xe
            </NavLink>
            <NavLink to="/busStation" className={navClass}>
              Bến xe
            </NavLink>
            <NavLink to="/routes" className={navClass}>
              Tuyến đường
            </NavLink>
            <NavLink to="/check-ticket" className={navClass}>
              Kiểm tra vé
            </NavLink>
          </nav>

          {/* Desktop actions (>=769px): Search + Login */}
          <div className="hidden md:flex items-center gap-[12px]">
            <button className="bg-[#FFA901] w-[33px] h-[31px] flex items-center justify-center rounded-[5px] text-white hover:bg-orange-500 transition-colors shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-[16px] h-[16px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            <div className="hidden lg:flex items-center">
              {!isLogin ? <FormAuth notify={notify} changeLoginState={setIsLogin} setUser={setUser} /> : <AvatarLogin user={user} onLogout={setIsLogin} />}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE/TABLET DRAWER (<=768px) ================= */}
      {/* ================= MOBILE DRAWER (ẢNH 1 CHUẨN) ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#1295db] text-white flex flex-col">
            {/* Header */}
            <div className="h-[56px] flex items-center justify-between px-4 border-b border-white/20">
              <img
                src={logoMain}
                alt="Vivu Today"
                className="h-7 object-contain brightness-0 invert"
              />
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="bg-white rounded-full flex items-center px-3 h-[38px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                />
                <span className="text-[#FFA901]">🔍</span>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex flex-col px-4 text-[14px] uppercase">
              {[
                { label: "Trang chủ", to: "/" },
                { label: "Giới thiệu", to: "/about-page" },
                { label: "Thông tin nhà xe", to: "/busCompany" },
                { label: "Bến xe", to: "/stations" },
                { label: "Tuyến đường", to: "/routes" },
                { label: "Kiểm tra vé", to: "/check-ticket" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) => ` py-3 border-b border-white/20 ${isActive ? "font-bold text-white" : "text-white/90"} `}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Login */}
            <div className="p-4 mt-auto">
              <button className="w-full h-[40px] bg-white text-[#1295db] font-semibold rounded-md">
                {!isLogin && <FormAuth notify={notify} setUser={setUser} changeLoginState={setIsLogin} />}
              </button>
            </div>
          </aside>
        </div>
      )}
      <Toaster
        position="top-right"

        reverseOrder={false}
      />
    </header>
  );
}
