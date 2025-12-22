

export default function PopularBus() {
  return (
    <div>
       <section className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Nhà Xe Phổ Biến
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4">

                    <button
                        className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white
                 items-center justify-center shadow text-sm shrink-0"
                        aria-hidden
                    >
                        ‹
                    </button>

                    {/* CARD LIST */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            </div>

                            <div className="px-3 flex items-center gap-2 text-xs">
                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
                                    1900 0179
                                </span>
                                <span className="bg-cyan-500 text-white px-2 py-1 rounded-full">
                                    HỆ THỐNG ĐẶT VÉ XE VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Nhà xe An Hòa Hiệp</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1600369672770-985fd30004eb"
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            </div>

                            <div className="px-3 flex items-center gap-2 text-xs">
                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
                                    1900 0179
                                </span>
                                <span className="bg-cyan-500 text-white px-2 py-1 rounded-full">
                                    HỆ THỐNG ĐẶT VÉ XE VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Nhà xe Futa Hà Sơn</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1612444530582-fc66183b16f8"
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            </div>

                            <div className="px-3 flex items-center gap-2 text-xs">
                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
                                    1900 0179
                                </span>
                                <span className="bg-cyan-500 text-white px-2 py-1 rounded-full">
                                    HỆ THỐNG ĐẶT VÉ XE VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Nhà xe Vũ Linh</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1583267746897-2cf415887172"
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            </div>

                            <div className="px-3 flex items-center gap-2 text-xs">
                                <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
                                    1900 0179
                                </span>
                                <span className="bg-cyan-500 text-white px-2 py-1 rounded-full">
                                    HỆ THỐNG ĐẶT VÉ XE VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Nhà xe Toàn Thắng</p>
                            </div>
                        </div>

                    </div>
                    <button
                        className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white
                 items-center justify-center shadow text-sm shrink-0"
                        aria-hidden
                    >
                        ›
                    </button>
                    <div className="flex gap-3 mt-4 lg:hidden justify-center">
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">‹</button>
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">›</button>
                    </div>

                </div>
            </section>
    </div>
  )
}
