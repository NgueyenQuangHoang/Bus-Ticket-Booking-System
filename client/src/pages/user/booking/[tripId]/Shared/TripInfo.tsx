/**
 * Component: TripInfo
 * Mục đích: Hiển thị danh sách các thẻ chuyến đi (Lượt đi/Lượt về).
 * Tính năng:
 *  - Hiển thị `TripCard` cho từng chặng.
 *  - Xử lý click nút "Chi tiết" để mở `TripDetailModal`.
 *  - Hiển thị timeline (Điểm đón/trả).
 */
import { useState } from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // For dots
import PersonIcon from "@mui/icons-material/Person";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LaunchIcon from "@mui/icons-material/Launch";

import TripDetailModal from "./TripDetailModal";

export interface TripData {
  id: string;
  type: "departure" | "return" | "single";
  dateStr: string;
  operator: {
    name: string;
    image: string;
    vehicleType: string;
    passengerCount: number;
    seatIds: string;
  };
  departure: {
    time: string;
    date: string;
    name: string;
    address: string;
  };
  arrival: {
    time: string;
    date: string;
    name: string;
    address: string;
  };
  policy: {
    text: string;
    colorClass: string;
  };
  totalPrice: number;
  ticketCode?: string;
  ticketCodes?: string[];
  priceDisplay?: string; // "300.000đ"
  route?: string;
  price?: string;
}

export const SHARED_TRIP: TripData = {
  id: "trip-4",
  type: "departure",
  dateStr: "T5, 25/12/2025",
  operator: {
    name: "Nhà xe An Hòa Hiệp",
    image: "https://res.cloudinary.com/dnvt1jxoe/image/upload/v1766410842/nxAnHoaHiep_hzyhjc.jpg",
    vehicleType: "Limousine 34 giường",
    passengerCount: 1,
    seatIds: "A01",
  },
  departure: {
    time: "19:00",
    date: "(25/12)",
    name: "Bến xe Miền Đông",
    address: "292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM",
  },
  arrival: {
    time: "05:00",
    date: "(26/12)",
    name: "Bến xe Mỹ Đình",
    address: "20 Phạm Hùng, Mỹ Đình, Hà Nội",
  },
  policy: {
    // Mock policy date matching 24h before
    text: "Phí hủy 10% trước 19:00 - 24/12/2025",
    colorClass: "text-orange-500",
  },
  totalPrice: 350000,
  ticketCode: "VÉ987654321",
  ticketCodes: ["VÉ987654321"],
  priceDisplay: "350.000đ",
  route: "Hồ Chí Minh - Hà Nội",
  price: "350.000đ"
};

// --- Sub-Component: TripCard ---
interface TripCardProps {
  trip: TripData;
  onDetailClick: (trip: TripData) => void;
}

function TripCard({ trip, onDetailClick }: TripCardProps) {
  const isDeparture = trip.type === "departure";
  const isReturn = trip.type === "return";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4 last:mb-0">
      {/* 1. Header */}
      <div className="bg-blue-50/50 p-3 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <DirectionsBusIcon fontSize="small" className="text-blue-600" />

          {/* Badge: CHIỀU ĐI / CHIỀU VỀ */}
          {(isDeparture || isReturn) && (
            <span className="bg-[#116ACF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase">
              {isDeparture ? "Chiều đi" : "Chiều về"}
            </span>
          )}

          <span className="text-sm font-bold text-gray-800">
            {trip.dateStr}
          </span>
        </div>
        <button
          className="text-sm text-blue-600 underline font-medium hover:text-blue-800 active:scale-95 hover:cursor-pointer"
          onClick={() => onDetailClick(trip)}
        >
          Chi tiết
        </button>
      </div>

      <div className="p-4">
        {/* 2. Operator Info */}
        <div className="flex gap-3 mb-6">
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={trip.operator.image}
              alt={trip.operator.name}
              className="w-full h-full rounded-md object-cover border border-gray-100 bg-gray-200"
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/48";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm truncate">
              {trip.operator.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {trip.operator.vehicleType}
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <PersonIcon
                  style={{ fontSize: 14 }}
                  className="text-gray-400"
                />
                <span>{trip.operator.passengerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <EventSeatIcon
                  style={{ fontSize: 14 }}
                  className="text-gray-400"
                />
                <span>{trip.operator.seatIds}</span>
                <LaunchIcon
                  style={{ fontSize: 12 }}
                  className="text-blue-500 ml-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Timeline */}
        {/* 3. Timeline - CSS Grid Layout */}
        <div className="grid grid-cols-[40px_24px_1fr] gap-x-4 pl-2">
          {/* Col 1: Start Time */}
          <div className="flex flex-col items-center text-center">
            <span className="text-lg font-bold text-gray-900 leading-none">
              {trip.departure.time}
            </span>
            <span className="text-[10px] text-gray-500 font-medium mt-1">
              {trip.departure.date}
            </span>
          </div>

          {/* Col 2: Visuals (Icons + Line) - Spans 2 rows */}
          <div className="row-span-2 flex flex-col items-center relative gap-1">
            {/* Start Icon Wrapper (matches mt-1.5) */}
            <div className="mt-1.5 flex-shrink-0 w-6 flex justify-center z-10 bg-white">
              <FiberManualRecordIcon
                style={{ fontSize: 14 }}
                className="text-blue-500"
              />
            </div>
            {/* Line - Flex grow to fill space */}
            <div className="w-[1px] bg-gray-300 flex-1"></div>
            {/* End Icon Wrapper (matches mt-1) */}
            <div className="mt-1 flex-shrink-0 w-6 flex justify-center z-10 bg-white">
              <PlaceIcon style={{ fontSize: 18 }} className="text-red-500" />
            </div>
          </div>

          {/* Col 3: Start Content */}
          <div className="pb-6">
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <p className="text-sm font-bold text-gray-900 pt-1">
                  {trip.departure.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {trip.departure.address}
                </p>
              </div>
              <button className="text-xs text-blue-600 font-medium whitespace-nowrap hover:underline hover:cursor-pointer pt-1">
                Thay đổi
              </button>
            </div>
          </div>

          {/* Col 1: End Time - Row 2 */}
          <div className="flex flex-col items-center text-center">
            <span className="text-lg font-bold text-gray-500 leading-none">
              {trip.arrival.time}
            </span>
            <span className="text-[10px] text-gray-500 font-medium mt-1">
              {trip.arrival.date}
            </span>
          </div>

          {/* Col 3: End Content - Row 2 */}
          <div>
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <p className="text-sm font-bold text-gray-900">
                  {trip.arrival.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {trip.arrival.address}
                </p>
              </div>
              <button className="text-xs text-blue-600 font-medium whitespace-nowrap hover:underline hover:cursor-pointer">
                Thay đổi
              </button>
            </div>
          </div>
        </div>

        {/* 4. Footer Policy */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className={`text-xs ${trip.policy.colorClass}`}>
            {trip.policy.text}
          </span>
          <InfoOutlinedIcon
            fontSize="small"
            className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
            style={{ fontSize: 16 }}
          />
        </div>
      </div>
    </div>
  );
}

// --- MAIN Component ---
interface TripInfoProps {
  trips: TripData[];
}

export default function TripInfo({ trips }: TripInfoProps) {
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailClick = (trip: TripData) => {
    setSelectedTrip(trip);
    // Slight delay to allow render before triggering animation
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Wait for animation (300ms) before unmounting
    setTimeout(() => {
      setSelectedTrip(null);
    }, 300);
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Thông tin chuyến đi
      </h3>

      {/* List of Trip Cards */}
      <div className="flex flex-col gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDetailClick={handleDetailClick}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTrip && (
        <TripDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          trip={selectedTrip}
        />
      )}
    </div>
  );
}
