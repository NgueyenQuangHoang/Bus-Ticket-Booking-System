import BannerA from "./components/BannerA";
import Banner from "./components/Banner";
import BusStation from "./components/PopularBusStation";
import ConnectIcon from "./components/ConnectIcon";
import PopularBus from "./components/PopularBus";
import PopularRoute from "./components/PopularRoute";
import TopReview from "./components/TopReview";
import VivuToday from "./components/VivuToday";


export default function HomePage() {
  return (
    <main className="bg-white">
      {/* ================= BANNER ================= */}
      <BannerA />

      {/* ================= TUYẾN ĐƯỜNG PHỔ BIẾN ================= */}
      <PopularRoute />

      {/* ================= ƯU ĐÃI NỔI BẬT ================= */}
      <Banner />

      {/* ================= NHÀ XE PHỔ BIẾN ================= */}
      <PopularBus />

      {/* ================= TOP REVIEWS ================= */}
      <TopReview />

      {/* ================= BẾN XE PHỔ BIẾN ================= */}
      <BusStation />

      {/* ================= NỀN TẢNG KẾT NỐI ================= */}
      <ConnectIcon />

      {/* ================= VIVUTODAY ĐƯỢC NHẮC TÊN ================= */}
      <VivuToday />
    </main>
  );
}
