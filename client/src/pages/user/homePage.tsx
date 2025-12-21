import bannerImage from "../../assets/Image.png";
import logo from "../../assets/Link.png";

export default function HomePage() {
    return (
        <main className="bg-white">

            {/* ================= BANNER ================= */}
            <section className="w-full">
                <img
                    src={bannerImage}
                    alt="Banner đặt vé xe"
                    className="w-full h-auto object-cover"
                />
            </section>

            {/* ================= TUYẾN ĐƯỜNG PHỔ BIẾN ================= */}
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


            {/* ================= ƯU ĐÃI NỔI BẬT ================= */}
            <section className="max-w-7xl mx-auto px-6 pb-12">
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Ưu Đãi Nổi Bật
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-3">

                    <button className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow text-lg shrink-0 hover:bg-orange-600 transition">
                        ‹
                    </button>

                    <div className="w-full flex-1 overflow-hidden rounded-xl">
                        <img
                            src="https://images.unsplash.com/photo-1522199710521-72d69614c702"
                            alt="Ưu đãi nổi bật"
                            className="w-full h-[200px] object-cover"
                        />
                    </div>

                    <button className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow text-lg shrink-0 hover:bg-orange-600 transition">
                        ›
                    </button>

                    <div className="flex gap-3 mt-4 lg:hidden justify-center">
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">‹</button>
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">›</button>
                    </div>

                </div>
            </section>



            {/* ================= NHÀ XE PHỔ BIẾN ================= */}
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

            {/* ================= TOP REVIEWS ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12">

                {/* TITLE */}
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">Top Reviews</h2>
                </div>

                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[340px] lg:ml-12 lg:mr-12">

                    <div className="col-span-2 rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1506973035872-a4f23ef8f7c4"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Sài Gòn</p>
                            <p className="text-xs">287 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Vũng Tàu</p>
                            <p className="text-xs">98 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Đà Lạt</p>
                            <p className="text-xs">87 bài viết</p>
                        </div>
                    </div>

                    <div className="col-span-2 rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Hà Nội</p>
                            <p className="text-xs">612 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Nha Trang</p>
                            <p className="text-xs">557 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Đà Nẵng</p>
                            <p className="text-xs">570 bài viết</p>
                        </div>
                    </div>

                </div>
            </section>



            {/* ================= BẾN XE PHỔ BIẾN ================= */}
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

            {/* ================= NỀN TẢNG KẾT NỐI ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12 bg-white">

                {/* TITLE */}
                <div className="flex items-center gap-2 mb-8 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Nền Tảng Kết Nối Người Dùng Và Nhà Xe
                    </h2>
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

\                    <div className="flex items-start gap-4">
                        <span className="text-3xl">⭐</span>
                        <div>
                            <p className="font-semibold">
                                ĐÁP ỨNG MỌI NHU CẦU TÌM KIẾM
                            </p>
                            <p className="text-sm text-gray-600">
                                Với hơn 5000+ tuyến đường và 1500+ nhà xe trên khắp cả nước
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="text-3xl">🏅</span>
                        <div>
                            <p className="font-semibold">
                                ĐẢM BẢO CÓ VÉ
                            </p>
                            <p className="text-sm text-gray-600">
                                Hoàn ngay 150% nếu không có vé, mang đến hành trình trọn vẹn
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="text-3xl">🤝</span>
                        <div>
                            <p className="font-semibold">
                                CAM KẾT GIỮ VÉ
                            </p>
                            <p className="text-sm text-gray-600">
                                Vivutoday cam kết hoàn 150% nếu nhà xe không giữ vé
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="text-3xl">📞</span>
                        <div>
                            <p className="font-semibold">
                                TỔNG ĐÀI HỖ TRỢ KHÁCH HÀNG 24/7
                            </p>
                            <p className="text-sm text-gray-600">
                                Giải quyết kịp thời vấn đề của khách hàng một cách nhanh chóng
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= VIVUTODAY ĐƯỢC NHẮC TÊN ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12 bg-white">

                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Vivutoday Được Nhắc Tên Trên
                    </h2>
                </div>

<div className="
  flex flex-wrap gap-6
  justify-center
  lg:justify-start lg:ml-22
">

  <img src={logo} className="h-8 w-24 object-contain" />
  <img src={logo} className="h-8 w-24 object-contain" />
  <img
    src={logo}
    className="h-8 w-24 object-contain hidden md:block"
  />
  <img
    src={logo}
    className="h-8 w-24 object-contain hidden md:block"
  />
  <img
    src={logo}
    className="h-8 w-24 object-contain hidden lg:block"
  />
</div>
            </section>

        </main>
    );
}
