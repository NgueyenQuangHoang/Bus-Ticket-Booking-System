import type { SeatPosition, SeatType } from '../../../../../types/seat';

interface Props {
  position: SeatPosition | null;
  seatTypes: SeatType[];
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SeatCell({ position, seatTypes, isSelected, onClick }: Props) {
  // Determine Style based on content
  let content = "";
  
  // Base classes for the cell container
  const baseClasses = "relative w-12 h-12 flex items-center justify-center cursor-pointer text-xs font-semibold transition-all duration-200";
  let specificClasses = "rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100";
  let style: React.CSSProperties = {};

  if (position) {
    if (position.is_driver_seat) {
      specificClasses = "rounded-full bg-gray-600 text-white border-none shadow-md";
      content = ""; // Icon handled below
    } else if (position.is_door) {
      specificClasses = "bg-yellow-50 text-yellow-700 border border-yellow-200 rounded";
      content = "Cửa";
    } else if (position.is_stair) {
      specificClasses = "bg-gray-200 text-gray-400 border border-gray-300 rounded";
      content = "|||";
    } else if (position.is_aisle) {
        // Transparent / Hidden but hoverable
        specificClasses = "bg-transparent border border-dashed border-gray-200 opacity-20 hover:opacity-100";
        content = "";
    } else if (position.seat_type_id) {
      const type = seatTypes.find(t => t.id === position.seat_type_id || t.seat_type_id === position.seat_type_id);
      
      specificClasses = "bg-white rounded-lg shadow-sm hover:shadow-md";
      
      if (type) {
        // Apply outline color based on seat type
        style = {
          borderColor: type.color,
          borderWidth: '2px',
          borderStyle: 'solid',
          color: type.color
        };
      } else {
        // Fallback if type not found
        specificClasses += " border-2 border-blue-400 text-blue-500";
      }
      
      content = position.label || "";
    } else if (position.label) {
      // Just a label, treated as generic seat
      specificClasses = "bg-white border-2 border-gray-300 rounded-lg text-gray-500";
      content = position.label;
    }
  }

  // Handle selection state
  if (isSelected) {
    specificClasses += " ring-2 ring-blue-500 ring-offset-2 z-10 scale-105 bg-blue-50";
  }

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${specificClasses}`}
      style={style}
    >
      {/* Driver Icon */}
      {/* Driver Icon */}
      {position?.is_driver_seat && (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 12V2"></path>
              <path d="M2 12h20"></path>
              <path d="M12 12l4.9 4.9"></path>
              <path d="M12 12l-4.9 4.9"></path>
          </svg>
      )}

      {/* Seat Visuals for Standard Seats (with type) */}
      {position?.seat_type_id && !position.is_driver_seat && (
        <>
            {(() => {
                const type = seatTypes.find(t => t.id === position.seat_type_id || t.seat_type_id === position.seat_type_id);
                const typeName = type?.type_name?.toLowerCase() || '';
                const isDoubleBed = typeName.includes('giường đôi');
                const isSeat = typeName.includes('ghế');

                if (isDoubleBed) {
                    return (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                            <div className="w-3 h-3 border-2 rounded-full" style={{ borderColor: style.color || 'currentColor', opacity: 0.6 }}></div>
                            <div className="w-3 h-3 border-2 rounded-full" style={{ borderColor: style.color || 'currentColor', opacity: 0.6 }}></div>
                        </div>
                    );
                }
                
                if (isSeat) {
                     // Simple Seat Icon (Square with rounded corners, no inner details or simple line)
                    return (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 rounded-md opacity-40" style={{ borderColor: style.color || 'currentColor' }}></div>
                    );
                }

                // Default Single Bed
                return (
                    <>
                        {/* Simple "Bed" Icon inside */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-5 border-2 rounded-sm opacity-30" style={{ borderColor: style.color || 'currentColor' }}></div>
                        {/* Pillow/Headrest part */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[6px] flex gap-1">
                            <div className="w-3 h-1 bg-current rounded-full opacity-20"></div>
                            <div className="w-3 h-1 bg-current rounded-full opacity-20"></div>
                        </div>
                    </>
                );
            })()}
        </>
      )}
      
      {/* Content Label */}
      <span className="z-10 relative">{content}</span>
    </div>
  );
}