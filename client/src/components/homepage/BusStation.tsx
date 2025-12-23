import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

// Sample Bus Station Data
const busStations = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410844/bxMD_vcw8iq.jpg",
    name: "Bến xe Miền Đông Mới",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410844/bxMT_ldxsxj.jpg",
    name: "Bến xe Miền Tây",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410846/bxBG_dzhqh5.jpg",
    name: "Bến xe Giáp Bát",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410847/bxM%C4%90_uvnazz.jpg",
    name: "Bến xe Mỹ Đình",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410847/bxM%C4%90_uvnazz.jpg", // Added sample image
    name: "Bến xe Nước Ngầm",
  }
];

export default function BusStation() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 ml-15">
        <span className="w-1 h-6 bg-orange-500 rounded"></span>
        <h2 className="text-xl font-semibold">Bến Xe Phổ Biến</h2>
      </div>

      <div className="flex items-center gap-4 relative group">
        {/* Helper Navigation Buttons */}
        <button className="bus-station-prev hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            navigation={{
                nextEl: ".bus-station-next",
                prevEl: ".bus-station-prev",
            }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {busStations.map((station) => (
              <SwiperSlide key={station.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition duration-300">
                  <div className="relative">
                    <img
                      src={station.image}
                      alt={station.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                     <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium uppercase shadow-sm">
                        HỆ THỐNG ĐẶT VÉ XE TOÀN QUỐC
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-gray-800 text-[15px] truncate">
                      {station.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button className="bus-station-next hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronRight size={24} />
        </button>
      </div>

       {/* Mobile Navigation */}
        <div className="flex gap-4 mt-4 lg:hidden justify-center">
            <button className="bus-station-prev w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronLeft size={20} />
            </button>
            <button className="bus-station-next w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
                 <ChevronRight size={20} />
             </button>
        </div>
    </section>
  );
}
