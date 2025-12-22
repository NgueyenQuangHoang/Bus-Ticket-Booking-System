import Banner from "../../components/homepage/BannerA";
import BusStation from "../../components/homepage/BusStation";
import ConnectIcon from "../../components/homepage/ConnectIcon";
import PopularBus from "../../components/homepage/PopularBus";
import PopularRoute from "../../components/homepage/PopularRoute";
import Promotion from "../../components/homepage/Promotion";
import TopReview from "../../components/homepage/TopReview";
import VivuToday from "../../components/homepage/VivuToday";

export default function HomePage() {
    return (
        <main className="bg-white">

            {/* ================= BANNER ================= */}
            <Banner />

            {/* ================= TUYẾN ĐƯỜNG PHỔ BIẾN ================= */}
            <PopularRoute />


            {/* ================= ƯU ĐÃI NỔI BẬT ================= */}
           <Promotion />



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
