import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store";
import { searchTrips } from "../../../../slices/tripSearchSlice";
import type { TripSearchResult } from "../../../../services/tripSearchService";
import type { TimeSort, PriceSort } from "../BookingTicket";
import type { FiltersState } from "./FilterSidebar";
import SeatSelection from "./SeatSelection";

type Mode = "idle" | "detail" | "booking";
type DetailTab = "info" | "cancel";

interface SearchParams {
  from: string;
  to: string;
  date: string;
}

interface TripCardProps {
  searchParams?: SearchParams;
  timeSort?: TimeSort;
  priceSort?: PriceSort;
  filters?: FiltersState | null;
}

export default function TripCard({ searchParams, timeSort = "", priceSort = "", filters }: TripCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { trips, loading, error } = useSelector((state: RootState) => state.tripSearch);

  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [detailTab, setDetailTab] = useState<DetailTab>("info");

  // Filter và Sort trips
  const sortedTrips = useMemo(() => {
    if (!trips || trips.length === 0) return trips;

    let filtered = [...trips];

    // ===== APPLY FILTERS =====
    if (filters) {
      // 1. Filter theo giờ đi (departure time) - dựa vào hour trong ngày
      filtered = filtered.filter(trip => {
        const departureHour = new Date(trip.departure_time).getHours();
        return departureHour >= filters.time.min && departureHour <= filters.time.max;
      });

      // 2. Filter theo giá vé
      filtered = filtered.filter(trip => {
        return trip.price >= filters.price.min && trip.price <= filters.price.max;
      });

      // 3. Filter theo nhà xe được chọn
      if (filters.selectedCompanies.length > 0) {
        filtered = filtered.filter(trip =>
          filters.selectedCompanies.includes(trip.company_name)
        );
      }

      // 4. Filter theo tiêu chí phổ biến
      if (filters.popular.length > 0) {
        filtered = filtered.filter(trip => {
          // "Xe VIP Limousine" - kiểm tra tên xe hoặc tiện ích có chứa VIP/Limousine
          if (filters.popular.includes('Xe VIP Limousine')) {
            const busNameLower = trip.bus_name.toLowerCase();
            const amenitiesLower = (trip.bus_amenities || '').toLowerCase();
            const hasVIP = busNameLower.includes('vip') ||
              busNameLower.includes('limousine') ||
              amenitiesLower.includes('vip') ||
              amenitiesLower.includes('limousine');
            if (!hasVIP) return false;
          }

          // "Chuyến giảm giá" - có thể thêm logic sau nếu có field discount
          // Hiện tại bỏ qua vì chưa có data

          return true;
        });
      }
    }

    // ===== APPLY SORTING =====
    // Sort by departure time
    if (timeSort === "som-nhat") {
      filtered.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
    } else if (timeSort === "muon-nhat") {
      filtered.sort((a, b) => new Date(b.departure_time).getTime() - new Date(a.departure_time).getTime());
    }

    // Sort by price (secondary sort if time is also selected)
    if (priceSort === "thap-den-cao") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "cao-den-thap") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [trips, timeSort, priceSort, filters]);

  // Fetch trips khi searchParams thay đổi
  useEffect(() => {
    if (searchParams?.from && searchParams?.to) {
      dispatch(searchTrips({
        fromCity: searchParams.from,
        toCity: searchParams.to,
        date: searchParams.date || undefined,
      }));
    }
  }, [dispatch, searchParams?.from, searchParams?.to, searchParams?.date]);

  // Format thời gian
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  // Format thời lượng (phút -> giờ phút)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins + "p" : ""}`;
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-500">Đang tìm chuyến xe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // No search params
  if (!searchParams?.from || !searchParams?.to) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-gray-500">Vui lòng tìm kiếm chuyến xe từ trang chủ</p>
      </div>
    );
  }

  // No results
  if (trips.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white rounded-lg shadow">
        <div className="text-6xl mb-4">🚌</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy chuyến xe</h3>
        <p className="text-gray-500">
          Không có chuyến xe từ <strong>{searchParams.from}</strong> đến <strong>{searchParams.to}</strong>
          {searchParams.date && ` vào ngày ${searchParams.date}`}
        </p>
        <p className="text-gray-400 mt-2">Vui lòng thử tìm kiếm với ngày khác</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <p className="text-sm text-gray-500 mb-4">
        Tìm thấy {sortedTrips.length} chuyến xe
        {trips.length !== sortedTrips.length && (
          <span className="text-blue-500"> (đã lọc từ {trips.length} kết quả)</span>
        )}
      </p>

      {/* Thông báo khi không có kết quả sau khi filter */}
      {sortedTrips.length === 0 && trips.length > 0 && (
        <div className="w-full text-center py-10 bg-white rounded-lg shadow">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có chuyến xe phù hợp</h3>
          <p className="text-gray-500">Vui lòng điều chỉnh bộ lọc để xem thêm kết quả</p>
        </div>
      )}

      {sortedTrips.map((trip: TripSearchResult) => {
        const isActive = activeTripId === trip.schedule_id;
        return (
          <div
            key={trip.schedule_id}
            className="border border-gray-300 rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* SUMMARY */}
            <div className="flex xl:flex-row flex-col justify-between">
              <div className="flex gap-3 py-3">
                <img
                  src={trip.company_image || "https://via.placeholder.com/100?text=Bus"}
                  className="xl:w-25 xl:h-25 md:w-40 md:h-40 w-30 h-30 object-cover p-2 rounded-lg"
                  alt={trip.company_name}
                />
                <div className="flex flex-col xl:gap-2 md:gap-5 xl:w-125 md:flex-1 p-3">
                  <h3 className="font-semibold text-lg">
                    {trip.company_name}
                    {trip.company_rating && (
                      <>
                        <span className="text-yellow-500 ml-2">⭐ {trip.company_rating}</span>
                      </>
                    )}
                    <p className="text-sm text-gray-400 font-normal">{trip.bus_name}</p>
                  </h3>

                  {/* Time display */}
                  <div className="text-xl font-bold text-gray-600 flex justify-between items-center">
                    <p>{formatTime(trip.departure_time)}</p>
                    <div className="flex flex-col items-center justify-center min-w-20">
                      <span className="text-sm italic text-gray-500 mb-1.5 font-medium">
                        {formatDuration(trip.duration)}
                      </span>
                      <div className="relative w-full flex items-center">
                        <div className="h-1 w-full bg-gray-300 rounded-l-full"></div>
                        <div className="absolute -right-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-gray-300" />
                      </div>
                    </div>
                    <p>{formatTime(trip.arrival_time)}</p>
                  </div>

                  {/* Stations */}
                  <div className="flex justify-between text-sm">
                    <p className="text-blue-500">{trip.departure_station}</p>
                    <p className="text-blue-500">{trip.arrival_station}</p>
                  </div>

                  {/* Amenities & Detail button */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{trip.bus_amenities}</p>
                    <button
                      onClick={() => {
                        if (isActive && mode === "detail") {
                          setActiveTripId(null);
                          setMode("idle");
                        } else {
                          setActiveTripId(trip.schedule_id);
                          setMode("detail");
                        }
                      }}
                      className="text-blue-600 md:block hidden text-sm hover:underline"
                    >
                      {isActive && mode === "detail" ? "Ẩn chi tiết" : "Thông tin chi tiết"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Price & Book button */}
              <div className="flex xl:flex-col flex-row gap-3 p-3 xl:items-end justify-between">
                <div className="flex flex-col xl:mt-8 xl:text-right">
                  <h3 className="text-xl text-orange-500 font-bold">{formatPrice(trip.price)}</h3>
                  <h4 className="text-sm text-gray-500">{trip.available_seats} chỗ còn trống</h4>
                </div>
                <button
                  onClick={() => {
                    setActiveTripId(trip.schedule_id);
                    setMode("booking");
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Chọn chuyến
                </button>
              </div>
            </div>

            {/* DETAIL PANEL */}
            {isActive && mode === "detail" && (
              <div className="border-t pt-4 px-4 pb-4">
                <div className="flex gap-6 justify-center border-b mb-4">
                  <button
                    onClick={() => setDetailTab("info")}
                    className={`pb-2 ${detailTab === "info" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
                  >
                    Thông tin xe
                  </button>
                  <button
                    onClick={() => setDetailTab("cancel")}
                    className={`pb-2 ${detailTab === "cancel" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
                  >
                    Chính sách hủy
                  </button>
                </div>

                {detailTab === "info" && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nhà xe</p>
                        <p className="font-medium">{trip.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loại xe</p>
                        <p className="font-medium">{trip.bus_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tiện ích</p>
                        <p className="font-medium">{trip.bus_amenities || "Điều hòa"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số ghế</p>
                        <p className="font-medium">{trip.available_seats}/{trip.total_seats}</p>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === "cancel" && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Chính sách hủy vé:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                      <li>Hủy trước 24h: Hoàn 100% giá vé</li>
                      <li>Hủy trước 12h: Hoàn 70% giá vé</li>
                      <li>Hủy trước 6h: Hoàn 50% giá vé</li>
                      <li>Hủy sau 6h: Không hoàn tiền</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* BOOKING PANEL */}
            {isActive && mode === "booking" && (
              <div className="border-t pt-4 px-4 pb-4">
                <SeatSelection
                  layoutId={trip.layout_id}
                  scheduleId={trip.schedule_id}
                  price={trip.price}
                  trip={trip}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
