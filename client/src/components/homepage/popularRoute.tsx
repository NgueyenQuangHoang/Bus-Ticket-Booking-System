// đức đức

export default function PopularRoute() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Tuyến Đường Phổ Biến
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

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1506973035872-a4f23ef8f7c4"
                                    alt=""
                                    className="rounded-lg h-36 w-full object-cover"
                                />
                            </div>

                            <div className="px-3">
                                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                    VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Sài Gòn – Vũng Tàu</p>
                                <p className="text-sm text-gray-500">150.000đ</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                                    className="rounded-lg h-36 w-full object-cover"
                                />
                            </div>

                            <div className="px-3">
                                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                    VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Sài Gòn – Mũi Né</p>
                                <p className="text-sm text-gray-500">180.000đ</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                                    className="rounded-lg h-36 w-full object-cover"
                                />
                            </div>

                            <div className="px-3">
                                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                    VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Sài Gòn – Nha Trang</p>
                                <p className="text-sm text-gray-500">240.000đ</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow hover:shadow-md transition">
                            <div className="p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
                                    className="rounded-lg h-36 w-full object-cover"
                                />
                            </div>

                            <div className="px-3">
                                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                    VIVUTODAY
                                </span>
                            </div>

                            <div className="p-3">
                                <p className="font-semibold">Nha Trang – Đà Lạt</p>
                                <p className="text-sm text-gray-500">200.000đ</p>
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
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">
                            ‹
                        </button>
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">
                            ›
                        </button>
                    </div>

                </div>
            </section>

    </div>
  )
}
