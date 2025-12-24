/**
 * Component: TripDetails
 * Mục đích: Container hiển thị Thông tin chuyến đi và Chi tiết giá.
 * Tính năng:
 *  - Kết hợp `PriceSummary` và `TripInfo`.
 *  - Tính toán tổng tiền và thông tin vé để truyền vào `PriceSummary`.
 */
import PriceSummary from "./PriceSummary";
import TripInfo from "./TripInfo";
import type { TripData } from "./TripInfo";

interface TripDetailsProps {
    trips: TripData[];
}

export default function TripDetails({ trips }: TripDetailsProps) {
  // Tính tổng hợp dữ liệu từ danh sách chuyến đi
  const totalPrice = trips.reduce((acc, trip) => acc + trip.totalPrice, 0);
  const totalSeats = trips.reduce((acc, trip) => acc + (trip.operator.passengerCount || 1), 0);
  const allSeatIds = trips.map(trip => trip.operator.seatIds).join(", ");

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* --- PHẦN 1: TẠM TÍNH (ACCORDION) --- */}
      <PriceSummary 
        totalPrice={totalPrice} 
        seatCount={totalSeats} 
        seatIds={allSeatIds} 
      />

      {/* --- PHẦN 2: THÔNG TIN CHUYẾN ĐI --- */}
      <TripInfo trips={trips} />
    </div>
  );
}
