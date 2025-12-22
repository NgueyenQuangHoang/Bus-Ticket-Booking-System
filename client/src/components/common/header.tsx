import { useState } from "react";
import logoMain from "../../assets/loginmain.png";
import FormAuth from "../../ui/FromAuth";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="w-full font-['Segoe_UI']">
      {/* Top Bar */}
      <div className="bg-[#1295db] text-white h-[30px] flex items-center justify-between px-[170px] text-[12px]">
        <div className="flex items-center gap-1">
          <span>🚌</span>
          <span className="font-normal">Hệ thống Đặt Vé Xe Toàn Quốc</span>
        </div>

        <div className="hidden lg:flex items-center gap-6 opacity-60">
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

      {/* Main Header */}
      <div className="bg-white shadow-sm relative z-20 h-[60px] flex items-center px-[170px] gap-[90px]">
        {/* Mobile: Hamburger Button (Left) - Hidden on desktop */}
        <div className="lg:hidden absolute left-4">
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

        {/* Logo */}
        <div className="w-[100px] h-[60px] flex items-center justify-center">
          <img
            src={logoMain}
            alt="Vivu Today"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[8px] flex-1">
          <a
            href="/"
            className="bg-[#1190D4] text-white h-[41px] px-[10.5px] rounded-[7px] flex items-center justify-center font-bold text-[14px] uppercase tracking-[0.28px]"
          >
            Trang chủ
          </a>
          <a
            href="/about-page"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Giới thiệu
          </a>
          <a
            href="#"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Thông tin nhà xe
          </a>
          <a
            href="#"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Bến xe
          </a>
          <a
            href="#"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Tuyến đường
          </a>
          <a
            href="#"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Kiếm tra vé
          </a>
          <a
            href="#"
            className="h-[41px] px-[8px] flex items-center font-bold text-[14px] text-[#1190D4] uppercase tracking-[0.28px] hover:text-blue-800 transition-colors"
          >
            Travel
          </a>
        </nav>

        {/* Search / Actions (Right) */}
        <div className="hidden lg:flex items-center">
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
        </div>
        <div className="hidden lg:flex items-center">
          <FormAuth />
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-4 border-b flex items-center justify-between bg-[#1295db]">
              <img
                src={logoMain}
                alt="logo"
                className="h-8 object-contain brightness-0 invert"
              />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded text-white hover:bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col text-[#1295db] font-semibold text-base uppercase">
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Trang chủ
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Giới thiệu
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Thông tin nhà xe
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Bến xe
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Tuyến đường
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Kiểm tra vé
                </a>
                <a
                  href="#"
                  className="py-3 px-6 hover:bg-sky-50 border-l-4 border-transparent hover:border-[#1295db] transition-all"
                >
                  Travel
                </a>
              </nav>
              <div>
                <FormAuth />
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
