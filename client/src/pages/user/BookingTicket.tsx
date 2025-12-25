import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../../components/BookingTicket/FilterSidebar";
import SortBar from "../../components/BookingTicket/SortBar";
import TripCard from "../../components/BookingTicket/TripCards";
import BusSearchWidget from "../../components/homepage/BusSearchWidget";

export type TimeSort = "" | "som-nhat" | "muon-nhat";
export type PriceSort = "" | "thap-den-cao" | "cao-den-thap";

const BookingTicket = () => {
    // Đọc query params từ URL
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";

    // Sort options state
    const [timeSort, setTimeSort] = useState<TimeSort>("");
    const [priceSort, setPriceSort] = useState<PriceSort>("");

    // Format ngày hiển thị
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div className="w-full flex flex-col bg-gray-50 font-sans text-slate-900 py-10">
            <div className="max-w-7xl mx-auto w-full px-4">
                {/* Header hiển thị tuyến đường */}
                <h2 className="text-center text-2xl text-blue-500 font-bold mb-2">
                    {from && to ? `${from} → ${to}` : "Tìm chuyến xe"}
                </h2>
                {date && (
                    <p className="text-center text-gray-500 mb-6">
                        {formatDate(date)}
                    </p>
                )}

                {/* Widget tìm kiếm - cho phép tìm lại */}
                <div className="mt-5 mb-10">
                    <BusSearchWidget />
                </div>

                <div className="w-full flex justify-center px-5">
                    <SortBar 
                        timeSort={timeSort}
                        setTimeSort={setTimeSort}
                        priceSort={priceSort}
                        setPriceSort={setPriceSort}
                    />
                </div>

                {/* Main Content */}
                <div className="md:flex block w-full justify-between mt-10">
                    <div className="w-1/3 md:block hidden px-3">
                        {/* Filter Sidebar */}
                        <FilterSidebar />
                    </div>
                    <div className="md:w-2/3 px-3 w-full pb-4">
                        {/* Trip Cards - truyền search params và sort options */}
                        <TripCard 
                            searchParams={{ from, to, date }} 
                            timeSort={timeSort}
                            priceSort={priceSort}
                        />
                    </div>
                </div>

                <img 
                    src="/bannerBooking.png" 
                    alt="Banner" 
                    className="w-full mt-10 px-5 rounded-lg object-cover" 
                />
            </div>
        </div>
    );
};

export default BookingTicket;