import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { fetchBanners } from "../../../../slices/bannerSlice";

const Banner: React.FC = () => {
  const dispatch = useAppDispatch();
  const { banners } = useAppSelector((state) => state.banner);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // If no banners, render nothing or a default/loading state (optional)
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex items-center gap-2 mb-4 ml-15">
        <span className="w-1 h-6 bg-orange-500 rounded"></span>
        <h2 className="text-xl font-semibold">Ưu Đãi Nổi Bật</h2>
      </div>

      <div className="flex items-center gap-4 relative group">
        {/* Custom Navigation Button Prev */}
        <button className="custom-prev hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 overflow-hidden rounded-xl">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            className="mySwiper w-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.banner_id}>
                <div className="w-full aspect-[16/5] relative">
                  <img
                    src={banner.image_url}
                    alt="Banner"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Navigation Button Next */}
        <button className="custom-next hidden lg:flex w-10 h-10 rounded-full bg-orange-500 text-white items-center justify-center shadow-lg hover:bg-orange-600 transition shrink-0 cursor-pointer z-10">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Mobile Navigation (Centered below) */}
      <div className="flex gap-4 mt-4 lg:hidden justify-center">
        <button className="custom-prev w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
          <ChevronLeft size={20} />
        </button>
        <button className="custom-next w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition cursor-pointer">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Banner;