import Banner from "../../components/homepage/BannerA";
import BusStation from "../../components/homepage/BusStation";
import ConnectIcon from "../../components/homepage/ConnectIcon1";
import PopularBus from "../../components/homepage/PopularBus1";
import PopularRoute from "../../components/homepage/PopularRoute1";
import Promotion from "../../components/homepage/Promotion1";
import TopReview from "../../components/homepage/TopReview1";
import VivuToday from "../../components/homepage/VivuToday1";

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
