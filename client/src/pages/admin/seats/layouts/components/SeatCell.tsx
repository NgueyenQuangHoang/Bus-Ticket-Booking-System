import type { SeatPosition, SeatType } from '../../../../../types/seat';

interface Props {
  position: SeatPosition | null;
  seatTypes: SeatType[];
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SeatCell({ position, seatTypes, isSelected, onClick }: Props) {
  // Determine Style based on content
  let bgClass = "bg-gray-50 hover:bg-gray-100";
  let content = "";

  if (position) {
    bgClass = "bg-white";

    if (position.is_driver_seat) {
      bgClass = "bg-gray-700 text-white";
      content = "Tài";
    } else if (position.is_door) {
      bgClass = "bg-yellow-50 text-yellow-700";
      content = "Cửa";
    } else if (position.is_stair) {
      bgClass = "bg-gray-200 text-gray-500";
      content = "|||";
    } else if (position.seat_type_id) {
      const type = seatTypes.find(t => t.id === position.seat_type_id || t.seat_type_id === position.seat_type_id);
      if (type) {
        bgClass = "text-white";
      } else {
        bgClass = "bg-blue-100 border border-blue-400";
      }
      content = position.label || "Ghế";
    } else if (position.label) {
      bgClass = "bg-white border border-gray-300 rounded";
      content = position.label;
    }
  }

  const typeColor = position?.seat_type_id 
    ? seatTypes.find(t => t.id === position.seat_type_id || t.seat_type_id === position.seat_type_id)?.color 
    : undefined;

  return (
    <div 
      onClick={onClick}
      className={`relative w-12 h-14 flex items-center justify-center cursor-pointer text-xs font-semibold
        ${bgClass} ${isSelected ? 'ring-2 ring-blue-500 z-10 scale-105' : ''} transition-all duration-200
        ${position?.seat_type_id ? 'rounded-t-lg rounded-b-md shadow-sm hover:shadow-md' : 'rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'}
        ${position?.is_driver_seat ? 'rounded-full border-none shadow-md' : ''}
        ${position?.is_door || position?.is_stair ? 'border border-gray-200 rounded-sm' : ''}
      `}
      style={{ backgroundColor: typeColor && !position?.is_driver_seat ? typeColor : undefined, color: typeColor ? '#fff' : undefined }}
    >
      {/* Headrest visual */}
      {position?.seat_type_id && (
        <div className="absolute -top-1 w-8 h-1.5 bg-black/10 rounded-full mx-auto"></div>
      )}
      
      {/* Content */}
      <span className="z-10">{content}</span>

      {/* Armrests visual */}
      {position?.seat_type_id && (
        <>
          <div className="absolute bottom-2 left-0.5 w-1 h-6 bg-black/5 rounded-r"></div>
          <div className="absolute bottom-2 right-0.5 w-1 h-6 bg-black/5 rounded-l"></div>
        </>
      )}
    </div>
  );
}