//a
export default function BusStation() {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-6 py-12">

                {/* TITLE */}
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Bến Xe Phổ Biến
                    </h2>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col lg:flex-row items-center gap-4">

                    {/* LEFT ARROW (lg only) */}
                    <button
                        className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white
                 items-center justify-center shadow text-sm shrink-0"
                        aria-hidden
                    >
                        ‹
                    </button>

                    {/* CARD LIST */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">

                        {/* CARD 1 */}
                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="relative p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1529070538774-1843cb3265df"
                                    className="rounded-lg h-36 w-full object-cover"
                                />

                                {/* BADGE */}
                                <span
                                    className="absolute bottom-3 left-3 bg-orange-500 text-white
                       text-xs px-3 py-1 rounded-full"
                                >
                                    HỆ THỐNG ĐẶT VÉ XE TOÀN QUỐC
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Bến xe Miền Đông Mới</p>
                            </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="relative p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
                                    className="rounded-lg h-36 w-full object-cover"
                                />

                                <span
                                    className="absolute bottom-3 left-3 bg-orange-500 text-white
                       text-xs px-3 py-1 rounded-full"
                                >
                                    HỆ THỐNG ĐẶT VÉ XE TOÀN QUỐC
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Bến xe Miền Tây</p>
                            </div>
                        </div>

                        {/* CARD 3 */}
                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="relative p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
                                    className="rounded-lg h-36 w-full object-cover"
                                />

                                <span
                                    className="absolute bottom-3 left-3 bg-orange-500 text-white
                       text-xs px-3 py-1 rounded-full"
                                >
                                    HỆ THỐNG ĐẶT VÉ XE TOÀN QUỐC
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Bến xe Giáp Bát</p>
                            </div>
                        </div>

                        {/* CARD 4 */}
                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="relative p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1583267746897-2cf415887172"
                                    className="rounded-lg h-36 w-full object-cover"
                                />

                                <span
                                    className="absolute bottom-3 left-3 bg-orange-500 text-white
                       text-xs px-3 py-1 rounded-full"
                                >
                                    HỆ THỐNG ĐẶT VÉ XE TOÀN QUỐC
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Bến xe Mỹ Đình</p>
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
