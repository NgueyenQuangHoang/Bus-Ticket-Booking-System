import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

// Sample Popular Route Data
const popularRoutes = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410525/sg-vt_bcgm29.png",
    title: "Sài Gòn - Vũng Tàu",
    price: "150.000đ",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410530/sg-mn_zz0prg.png",
    title: "Sài Gòn - Mũi Né",
    price: "180.000đ",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410525/sg-nt_ffltel.png",
    title: "Sài Gòn - Nha Trang",
    price: "240.000đ",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410532/sg-dl_qbddyl.png",
    title: "Nha Trang - Đà Lạt",
    price: "200.000đ",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410532/sg-dl_qbddyl.png",
    title: "Sài Gòn - Đà Lạt",
    price: "220.000đ",
  },
];

export default function PopularRoute() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 ml-15">
        <span className="w-1 h-6 bg-orange-500 rounded"></span>
        <h2 className="text-xl font-semibold">Tuyến Đường Phổ Biến</h2>
      </div>

      <div className="flex items-center gap-4 relative group">
        
        {/* Helper Navigation Buttons (External to Swiper to match Banner style) */}
         <button className="popular-route-prev hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            navigation={{
                nextEl: ".popular-route-next",
                prevEl: ".popular-route-prev",
            }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {popularRoutes.map((route) => (
              <SwiperSlide key={route.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition duration-300">
                  <div className="relative">
                    <img
                      src={route.image}
                      alt={route.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-bold text-gray-800 text-[15px] truncate">
                      {route.title}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mt-1">
                      {route.price}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button className="popular-route-next hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronRight size={24} />
        </button>
      </div>

       {/* Mobile Navigation */}
        <div className="flex gap-4 mt-4 lg:hidden justify-center">
            <button className="popular-route-prev w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronLeft size={20} />
            </button>
            <button className="popular-route-next w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronRight size={20} />
             </button>
        </div>
    </section>
  );
}
