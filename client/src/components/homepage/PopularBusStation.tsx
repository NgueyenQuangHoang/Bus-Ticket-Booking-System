import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchPopularStations } from "../../slices/stationSlice";

export default function BusStation() {
  const dispatch = useAppDispatch();
  const { popularStations } = useAppSelector((state) => state.station);

  useEffect(() => {
    dispatch(fetchPopularStations(10)); // Fetch top 10 popular stations
  }, [dispatch]);

  // Optionally handle loading state
  if (!popularStations || popularStations.length === 0) {
      return null;
  }

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
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {popularStations.map((station) => (
              <SwiperSlide key={station.station_id}>
                <div 
                  className="flex flex-col items-start p-4 gap-3 h-[250px] rounded-[10px] hover:shadow-md transition duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.002)',
                    border: '1px solid #ECEEEB',
                    boxShadow: '0px 5px 5px rgba(76, 76, 76, 0.1)',
                  }}
                >
                  <img
                    src={station.image}
                    alt={station.station_name}
                    className="w-full flex-1 object-cover rounded-[10px]"
                    style={{ minHeight: '159px' }}
                  />
                  <div className="flex flex-col items-start gap-1 w-full rounded-[10px]">
                    <h3 
                      className="w-full h-6 font-bold text-lg leading-6 flex items-center truncate"
                      style={{ 
                        fontFamily: 'Segoe UI, sans-serif',
                        color: '#00613D' 
                      }}
                    >
                      {station.station_name}
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
