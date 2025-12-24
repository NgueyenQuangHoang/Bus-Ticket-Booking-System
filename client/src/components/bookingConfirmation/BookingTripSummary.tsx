/**
 * Component: BookingTripSummary
 * Mục đích: Sidebar hiển thị tóm tắt thông tin chuyến đi (dùng chung cho các bước Thanh toán & Hoàn tất).
 * Tính năng:
 *  - Hiển thị thông tin nhà xe, giờ khởi hành/đến, lộ trình.
 *  - Hiển thị tổng tiền (tùy chọn).
 */
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LaunchIcon from "@mui/icons-material/Launch";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PlaceIcon from "@mui/icons-material/Place";
import type { TripData } from "./TripInfo";

interface BookingTripSummaryProps {
  trip: TripData;
  actionNode?: React.ReactNode; // For custom buttons below summary
}

export default function BookingTripSummary({ trip, actionNode }: BookingTripSummaryProps) {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Thông tin chuyến đi
      </h3>

      {/* Date Header */}
      <div className="flex items-center gap-2 mb-4">
        <DirectionsBusIcon fontSize="small" className="text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          {trip.dateStr}
        </span>
      </div>

      {/* Operator Info */}
      <div className="flex gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={trip.operator.image}
            alt={trip.operator.name}
            className="w-full h-full rounded-md object-cover border border-gray-100 bg-gray-200"
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

      {/* Timeline */}
      <div className="grid grid-cols-[40px_24px_1fr] gap-x-4 pl-2 mb-6">
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
          <div className="mt-1.5 flex-shrink-0 w-6 flex justify-center z-10 bg-white">
            <FiberManualRecordIcon
              style={{ fontSize: 14 }}
              className="text-blue-500"
            />
          </div>
          <div className="w-[1px] bg-gray-300 flex-1"></div>
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
            {/* Optional Change button */}
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
          </div>
        </div>
      </div>

      {/* Policy */}
      {trip.policy && (
         <p className={`text-xs ${trip.policy.colorClass} mb-4`}>
            {trip.policy.text}
         </p>
      )}

       {/* Price & Action */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tổng tiền:</span>
          <span className="text-2xl font-bold text-[#ff6b00]">
            {trip.totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
        
        {/* Render buttons injected from parent */}
        {actionNode}
      </div>
    </div>
  );
}
