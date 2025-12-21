import React, { useState } from "react";
import logo from "../../assets/logo.jpg";
import logoMain from "../../assets/loginmain.png";

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <header className="w-full">
            <div className="bg-sky-500 text-white text-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-9">
                    <div className="mx-auto lg:mx-0 flex items-center gap-2 ">
                        🚌
                        <span>Hệ thống Đặt Vé Xe Toàn Quốc</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <span>✉ info.vivutoday@gmail.com</span>
                        <span>📞 1900 0152</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto relative flex items-center px-4 h-16">

                    <div className="flex items-center">
                        <div className="ml-2 lg:hidden">
                            <button
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                                className="w-9 h-9 flex items-center justify-center rounded bg-sky-500 text-white"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <img src={logoMain} alt="Vivu Today" className="h-9 object-contain" />
                    </div>



                    <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-full flex justify-center items-center gap-6 text-sm font-semibold text-sky-600">
                        <a className="bg-sky-500 text-white px-4 py-1.5 rounded">TRANG CHỦ</a>
                        <a className="hover:text-sky-800">GIỚI THIỆU</a>
                        <a className="hover:text-sky-800">THÔNG TIN NHÀ XE</a>
                        <a className="hover:text-sky-800">BẾN XE</a>
                        <a className="hover:text-sky-800">TUYẾN ĐƯỜNG</a>
                        <a className="hover:text-sky-800">KIỂM TRA VÉ</a>

                        <button className="bg-yellow-400 w-9 h-9 flex items-center justify-center rounded">🔍</button>
                    </nav>
                </div>
            </div>

            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close menu"
                        onClick={() => setDrawerOpen(false)}
                    />

                    <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <img src={logo} alt="logo" className="h-8 object-contain" />
                            <button
                                onClick={() => setDrawerOpen(false)}
                                aria-label="Close menu"
                                className="w-9 h-9 flex items-center justify-center rounded bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="flex flex-col mt-4 gap-3 text-sky-600 font-semibold">
                            <a className="py-2 px-2 rounded hover:bg-sky-50">TRANG CHỦ</a>
                            <a className="py-2 px-2 rounded hover:bg-sky-50">GIỚI THIỆU</a>
                            <a className="py-2 px-2 rounded hover:bg-sky-50">THÔNG TIN NHÀ XE</a>
                            <a className="py-2 px-2 rounded hover:bg-sky-50">BẾN XE</a>
                            <a className="py-2 px-2 rounded hover:bg-sky-50">TUYẾN ĐƯỜNG</a>
                            <a className="py-2 px-2 rounded hover:bg-sky-50">KIỂM TRA VÉ</a>
                        </nav>
                    </aside>
                </div>
            )}
        </header>
    );
}




