/**
 * Component: TripDetails
 * Mục đích: Container hiển thị Thông tin chuyến đi và Chi tiết giá.
 * Tính năng:
 *  - Kết hợp `PriceSummary` và `TripInfo`.
 */
import PriceSummary from "./PriceSummary";
import TripInfo from "./TripInfo";

export default function TripDetails() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* --- PHẦN 1: TẠM TÍNH (ACCORDION) --- */}
      <PriceSummary />

      {/* --- PHẦN 2: THÔNG TIN CHUYẾN ĐI --- */}
      <TripInfo />
    </div>
  );
}
