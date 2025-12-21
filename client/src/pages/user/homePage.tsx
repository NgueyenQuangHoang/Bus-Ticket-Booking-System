import Banner from "../../components/homepage/banner";
import BusStation from "../../components/homepage/busStation";
import ConnectIcon from "../../components/homepage/connectIcon";
import PopularBus from "../../components/homepage/popularBus";
import PopularRoute from "../../components/homepage/popularRoute";
import Promotion from "../../components/homepage/promotion";
import TopReview from "../../components/homepage/topReview";
import VivuToday from "../../components/homepage/vivuToday";

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
