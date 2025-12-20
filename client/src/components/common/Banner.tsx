import { useEffect, useState } from "react";
import { bannerService } from "../../services/bannerService";
import type { Banner }  from "../../types.ts";

const Banner:React.FC = () => {
    const [activeBanners, setActiveBanners] = useState<Banner[]>([]);
    useEffect(() => {
        const fetchBanners = async () => {
            try {
        const allBanners = await bannerService.getAllBanners();
        const now = new Date();

        // Lọc banner theo thời gian ngay tại Frontend
        const filtered = allBanners.filter((activeBanner: Banner) => {
          if (!activeBanner.start_date || !activeBanner.end_date) return false;
          const start = new Date(activeBanner.start_date);
          const end = new Date(activeBanner.end_date);
          return now >= start && now <= end && activeBanner.position === "Trang chủ";
        });

        setActiveBanners(filtered);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu banner:", error);
      }
        };
        fetchBanners();
    }, []);
    return (
        <div className="banner-slider">
      {activeBanners.map((activeBanner) => (
        <img 
          key={activeBanner.banner_id} 
          src={activeBanner.banner_url} 
          alt={`Banner quảng cáo ${activeBanner.banner_id}`} 
        />
      ))}
    </div>
    );
};

export default Banner;