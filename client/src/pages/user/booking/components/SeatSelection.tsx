import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import seatService from "../../../../services/admin/seatService";
import bookingService from "../../../../services/bookingService";
import type { SeatPosition, BusLayout, SeatType } from "../../../../types/seat";
import type { SeatSchedule } from "../../../../services/bookingService";
import type { TripSearchResult } from "../../../../services/tripSearchService";

const COLORS = {
  disabledBg: "bg-zinc-200",
  disabledFg: "text-zinc-300",
  selectedBg: "bg-emerald-400",
  selectedBorder: "border-emerald-600",
  purpleBorder: "border-violet-500",
  orangeBorder: "border-orange-500",
  grayBorder: "border-gray-500",
};

type SeatVariant = "purple" | "orange" | "disabled" | "selected" | "gray";

interface SeatIconProps {
  variant?: SeatVariant;
  showX?: boolean;
  className?: string;
  color?: string; // Hex color from DB
}

function SeatIcon({
  variant = "purple",
  showX = false,
  className = "",
  color,
}: SeatIconProps) {
  const customStyle = color && variant !== 'disabled' && variant !== 'selected' 
    ? { borderColor: color, color: color } 
    : {};

  const styles = {
    disabled: `border ${COLORS.disabledBg} ${COLORS.disabledFg} border-zinc-200`,
    selected: `border ${COLORS.selectedBg} ${COLORS.selectedBorder} text-emerald-700`,
    purple: `border border-violet-500 text-violet-500`,
    orange: `border border-orange-500 text-orange-500`,
    gray: `border border-gray-500 text-gray-500`,
  }[variant] || `border border-[${color}] text-[${color}]`;

  return (
    <div
      className={[
        "relative h-8 w-10 sm:h-10 sm:w-12 rounded-md flex items-end justify-center",
        customStyle.borderColor ? "border bg-white" : "border bg-white " + styles,
        className,
      ].join(" ")}
      style={customStyle}
    >
      {showX && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold opacity-70">
          ×
        </div>
      )}
      <div className="mb-1 flex gap-1">
        <div className="h-2 w-3 sm:h-2.5 sm:w-4 rounded-[1px] border border-current opacity-70" />
        <div className="h-2 w-3 sm:h-2.5 sm:w-4 rounded-[1px] border border-current opacity-70" />
      </div>
      {variant === "selected" && (
        <div className="absolute -left-1 -top-1 h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
          ✓
        </div>
      )}
    </div>
  );
}

interface LegendRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

function LegendRow({ icon, title, subtitle }: LegendRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-zinc-800">{title}</div>
        {subtitle ? <div className="text-xs text-zinc-500 mt-0.5">{subtitle}</div> : null}
      </div>
    </div>
  );
}

interface PriceLineProps {
  price: number;
}

function PriceLine({ price }: PriceLineProps) {
  return (
    <div className="mt-1 flex items-baseline gap-2">
      <span className="text-base font-bold text-zinc-800">
        {price.toLocaleString("vi-VN")}đ
      </span>
    </div>
  );
}

const resolveSeatTypeColor = (type: SeatType | undefined): string => {
  if (!type) return "#6b7280"; // default gray
  const name = (type.type_name || "").toLowerCase();
  // Preferred brand colors
  if (name.includes("giường đôi")) return "#0ea5e9"; // cyan/blue
  if (name.includes("giường đơn")) return "#7c3aed"; // purple
  if (name.includes("vip")) return "#f97316"; // orange accent
  return type.color || "#6b7280";
};

function Legend({ basePrice, seatTypesUsed, seatTypeMap }: { basePrice: number; seatTypesUsed: Array<string | number>; seatTypeMap: Map<string, SeatType>; }) {
  const items = seatTypesUsed
    .map((id) => seatTypeMap.get(String(id)))
    .filter((t): t is SeatType => Boolean(t));

  return (
    <div className="w-full xl:max-w-xs">
      <h2 className="text-lg font-bold text-zinc-800 mb-4">Chú thích</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
        <LegendRow
          icon={<SeatIcon variant="disabled" showX />}
          title="Đã bán"
        />
        <LegendRow
          icon={<SeatIcon variant="selected" />}
          title="Đang chọn"
        />
      </div>
      <div className="space-y-3 border-t pt-3">
        {items.length === 0 ? (
          <div className="flex items-start gap-3">
            <SeatIcon variant="gray" />
            <div>
              <div className="text-sm font-semibold text-zinc-800">
                Ghế tiêu chuẩn
              </div>
              <PriceLine price={basePrice} />
            </div>
          </div>
        ) : (
          items.map((t) => (
            <div key={t.id || t.seat_type_id} className="flex items-start gap-3">
              <SeatIcon variant="gray" color={resolveSeatTypeColor(t)} />
              <div>
                <div className="text-sm font-semibold text-zinc-800">{t.type_name}</div>
                <PriceLine price={Math.round(basePrice * (t.price_multiplier || 1))} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type SeatStatus = "disabled" | "purple" | "orange" | "gray";

interface SeatProps {
  status: SeatStatus;
  selected: boolean;
  onClick: () => void;
  showX?: boolean;
  label?: string;
  color?: string;
}

function Seat({ status, selected, onClick, showX, label, color }: SeatProps) {
  const variant: SeatVariant = selected ? "selected" : status;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "disabled"}
      className={[
        "relative transition active:scale-[0.98] disabled:cursor-not-allowed",
        "disabled:opacity-70 group",
      ].join(" ")}
      aria-label={`Seat ${label}`}
    >
      <SeatIcon
        variant={variant}
        showX={showX ?? status === "disabled"}
        className="shadow-sm"
        color={color}
      />
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
        {label}
      </span>
    </button>
  );
}

interface SeatData {
  id: string;
  status: SeatStatus;
  showX?: boolean;
  label?: string;
  seatTypeId?: string | number;
  color?: string;
  priceMultiplier?: number;
}

interface FloorCardProps {
  title: string;
  hasSteering: boolean;
  grid: (SeatData | null)[];
  selectedSet: Set<string>;
  toggleSeat: (id: string, seat: SeatData) => void;
  columns: number;
}

function FloorCard({ title, hasSteering, grid, selectedSet, toggleSeat, columns }: FloorCardProps) {
  return (
    <div className="flex-1">
      <h3 className="text-base font-semibold text-zinc-700 mb-3 text-center">
        {title}
      </h3>
      <div className="rounded-xl bg-zinc-100 p-4 max-w-[240px] mx-auto border border-zinc-200">
        {hasSteering ? (
          <div className="mb-4 flex justify-start">
            <div className="h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm border border-zinc-200">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-zinc-500"
              >
                <path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12h7l2 2h2l2-2h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 12a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="mb-4 h-8" />
        )}
        <div 
          className="grid gap-x-3 gap-y-3 place-items-center"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {grid.map((seat, index) => {
            if (seat === null) return <div key={`empty-${index}`} />;
            const key = seat.id;
            return (
              <Seat
                key={key}
                status={seat.status}
                selected={selectedSet.has(key)}
                onClick={() => toggleSeat(key, seat)}
                showX={seat.showX}
                label={seat.label}
                color={seat.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SeatSelectionProps {
  layoutId?: string;
  scheduleId?: string;
  price?: number;
  trip: TripSearchResult;
}

export default function SeatSelection({ layoutId, scheduleId, price = 0, trip }: SeatSelectionProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState<BusLayout | null>(null);
  const [positions, setPositions] = useState<SeatPosition[]>([]);
  const [bookedSeats, setBookedSeats] = useState<SeatSchedule[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  
  useEffect(() => {
    if (!layoutId || !scheduleId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [layoutData, scheduleData, seatTypesData] = await Promise.all([
           seatService.getLayoutDetails(layoutId),
           bookingService.getSeatSchedule(scheduleId),
           seatService.getAllSeatTypes(),
        ]);
        if (layoutData) {
          setLayout(layoutData.layout);
          setPositions(layoutData.positions);
        }
        if (scheduleData) {
          setBookedSeats(scheduleData);
        }
        if (seatTypesData) {
          setSeatTypes(seatTypesData);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [layoutId, scheduleId]);

  const seatTypeMap = useMemo(() => {
    const map = new Map<string, SeatType>();
    seatTypes.forEach((t) => {
      map.set(String(t.id ?? t.seat_type_id), t);
    });
    return map;
  }, [seatTypes]);

  const { lowerFloor, upperFloor, seatLookup, seatTypesUsed } = useMemo(() => {
    if (!layout || positions.length === 0) return { lowerFloor: [], upperFloor: [], seatLookup: new Map<string, SeatData>(), seatTypesUsed: [] };

    const lookup = new Map<string, SeatData>();
    const usedTypes = new Set<string | number>();

    const processFloor = (floorNumber: 1 | 2) => {
      const floorPositions = positions.filter(p => p.floor === floorNumber);
      if (floorPositions.length === 0) return [];
      const grid: (SeatData | null)[] = [];
      const rows = layout.total_rows;
      const cols = layout.total_columns;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
           const pos = floorPositions.find(p => p.row_index === r + 1 && p.column_index === c + 1);
           if (pos && !pos.is_aisle && !pos.is_driver_seat && !pos.is_door && !pos.is_stair) {
             const isBooked = bookedSeats.some(s => 
               String(s.seat_id) === String(pos.id) && (s.status === 'BOOKED' || s.status === 'HOLD')
             );
             const seatType = pos.seat_type_id ? seatTypeMap.get(String(pos.seat_type_id)) : undefined;
             if (seatType) usedTypes.add(seatType.id ?? seatType.seat_type_id);
             const seat: SeatData = {
               id: String(pos.id || pos.position_id),
               status: isBooked ? 'disabled' : 'gray',
               showX: isBooked,
               label: pos.label || `${r+1}-${c+1}`,
               seatTypeId: pos.seat_type_id,
               color: resolveSeatTypeColor(seatType),
               priceMultiplier: seatType?.price_multiplier ?? 1,
             };
             lookup.set(seat.id, seat);
             grid.push(seat);
           } else {
             grid.push(null);
           }
        }
      }
      return grid;
    };

    return {
      lowerFloor: processFloor(1),
      upperFloor: processFloor(2),
      seatLookup: lookup,
      seatTypesUsed: Array.from(usedTypes),
    };
  }, [layout, positions, bookedSeats, seatTypeMap]);

  const toggleSeat = (id: string, seat: SeatData) => {
    if (seat.status === "disabled") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalPrice = useMemo(() => {
    let sum = 0;
    selected.forEach((id) => {
      const seat = seatLookup.get(id);
      const multiplier = seat?.priceMultiplier ?? 1;
      sum += price * multiplier;
    });
    return sum;
  }, [selected, seatLookup, price]);

  const handleContinue = () => {
    const formatDate = (date: Date) => {
       return `T${date.getDay() + 1 === 1 ? 8 : date.getDay() + 1}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    const selectedLabels: string[] = [];
    const lower = positions.filter(p => p.floor === 1);
    const upper = positions.filter(p => p.floor === 2);
    
    selected.forEach(id => {
       let pos = lower.find(p => String(p.id || p.position_id) === String(id));
       if (!pos) pos = upper.find(p => String(p.id || p.position_id) === String(id));
       if (pos && pos.label) selectedLabels.push(pos.label);
    });

    const tripData = {
      id: trip.schedule_id,
      type: "departure",
      dateStr: formatDate(new Date(trip.departure_time)),
      operator: {
        name: trip.company_name,
        image: trip.company_image || "",
        vehicleType: trip.bus_name,
        passengerCount: selected.size,
        seatIds: selectedLabels.join(", "),
      },
      departure: {
        time: new Date(trip.departure_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date(trip.departure_time).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' }),
        name: trip.departure_station,
        address: trip.departure_city,
      },
      arrival: {
        time: new Date(trip.arrival_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date(trip.arrival_time).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' }),
        name: trip.arrival_station,
        address: trip.arrival_city,
      },
      policy: {
        text: "Phí hủy 10% trước 24h khởi hành",
        colorClass: "text-orange-500",
      },
      totalPrice: totalPrice,
      priceDisplay: totalPrice.toLocaleString("vi-VN") + "đ",
      route: `${trip.departure_city} - ${trip.arrival_city}`,
      price: price.toLocaleString("vi-VN") + "đ"
    };

    navigate('/bookingConfirmation', { state: { trip: tripData, selectedSeats: Array.from(selected) } });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải sơ đồ ghế...</div>;
  if (!layout) return <div className="p-8 text-center text-gray-500">Chưa có thông tin sơ đồ ghế cho chuyến xe này.</div>;

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
        <Legend basePrice={price} seatTypesUsed={seatTypesUsed} seatTypeMap={seatTypeMap} />
        <div className="flex gap-4 md:gap-8 justify-center flex-1 w-full max-w-[500px]">
          <FloorCard
            title="Tầng dưới"
            hasSteering
            grid={lowerFloor}
            selectedSet={selected}
            toggleSeat={toggleSeat}
            columns={layout.total_columns}
          />
          {upperFloor.length > 0 && (
            <FloorCard
              title="Tầng trên"
              hasSteering={false}
              grid={upperFloor}
              selectedSet={selected}
              toggleSeat={toggleSeat}
              columns={layout.total_columns}
            />
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div>
           <p className="text-sm text-gray-500">Đã chọn: <span className="font-bold text-zinc-800">{selected.size}</span> ghế</p>
           <p className="text-sm font-semibold text-orange-600">
             {totalPrice.toLocaleString('vi-VN')}đ
           </p>
        </div>
        <button 
          onClick={handleContinue}
          disabled={selected.size === 0}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selected.size > 0 
              ? 'bg-orange-500 hover:bg-orange-600 text-white hover:cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
