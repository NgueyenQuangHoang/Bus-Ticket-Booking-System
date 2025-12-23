import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

// Sample Popular Bus Data
const popularBuses = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410842/nxAnHoaHiep_hzyhjc.jpg",
    name: "Nhà xe An Hòa Hiệp",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410843/nxFUTAH%C3%A1on_ryoa0n.jpg",
    name: "Nhà xe Futa Hà Sơn",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410849/nxVuLinh_gcrm2q.png",
    name: "Nhà xe Vũ Linh",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410844/nxToanThang_rjxmkc.jpg",
    name: "Nhà xe Toàn Thắng",
  },
  {
      id: 5,
      image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410844/nxToanThang_rjxmkc.jpg",
      name: "Nhà xe Phương Trang",
  }
];

export default function PopularBus() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 ml-15">
        <span className="w-1 h-6 bg-orange-500 rounded"></span>
        <h2 className="text-xl font-semibold">Nhà Xe Phổ Biến</h2>
      </div>

      <div className="flex items-center gap-4 relative group">
         {/* Helper Navigation Buttons */}
         <button className="popular-bus-prev hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            navigation={{
                nextEl: ".popular-bus-next",
                prevEl: ".popular-bus-prev",
            }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {popularBuses.map((bus) => (
              <SwiperSlide key={bus.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition duration-300">
                  <div className="relative">
                    <img
                      src={bus.image}
                      alt={bus.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-bold text-gray-800 text-[15px] truncate">
                      {bus.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

         <button className="popular-bus-next hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Mobile Navigation */}
        <div className="flex gap-4 mt-4 lg:hidden justify-center">
            <button className="popular-bus-prev w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronLeft size={20} />
            </button>
            <button className="popular-bus-next w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronRight size={20} />
             </button>
        </div>
    </section>
  );
}
