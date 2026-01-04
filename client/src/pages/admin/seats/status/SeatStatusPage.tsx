import React, { useMemo, useState, useEffect } from "react";
import { 
    seatStatusService, 
    type Route, 
    type Schedule, 
    type SeatStatusData 
} from "../../../../services/seatStatusService";

// --- Types ---
type SeatStatus = "AVAILABLE" | "BOOKED" | "HELD";

// --- Components ---

const STATUS_META: Record<
  SeatStatus,
  { label: string; pillClass: string; textClass: string }
> = {
  AVAILABLE: {
    label: "AVAILABLE",
    pillClass: "bg-emerald-50 ring-emerald-100",
    textClass: "text-emerald-700",
  },
  BOOKED: {
    label: "BOOKED",
    pillClass: "bg-rose-50 ring-rose-100",
    textClass: "text-rose-700",
  },
  HELD: {
    label: "HELD",
    pillClass: "bg-amber-50 ring-amber-100",
    textClass: "text-amber-700",
  },
};

function StatusPill({ status }: { status: SeatStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        "ring-1 ring-inset",
        meta.pillClass,
        meta.textClass,
      ].join(" ")}
    >
      {meta.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={["mt-2 text-2xl font-semibold", valueClassName].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  ariaLabel,
  disabled = false,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3",
          "text-sm text-slate-700 shadow-sm outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all",
          disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""
        ].join(" ")}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* caret */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" className={`text-slate-400 ${disabled ? 'opacity-50' : ''}`}>
          <path
            fill="currentColor"
            d="M7 10l5 5l5-5H7z"
          />
        </svg>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function SeatStatusPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [seatData, setSeatData] = useState<{
      seats: SeatStatusData[];
      totalSeats: number;
      booked: number;
      held: number;
      available: number;
  } | null>(null);

  // 1. Fetch Routes on Mount
  useEffect(() => {
    seatStatusService.getRoutes().then((data) => {
        setRoutes(data);
    });
  }, []);

  const handleRouteChange = (routeId: string) => {
      setSelectedRouteId(routeId);
      // Reset dependent states
      setSchedules([]);
      setSelectedScheduleId("");
      setSeatData(null);
      
      if (routeId) {
          seatStatusService.getSchedulesByRoute(routeId).then((data) => {
              setSchedules(data);
          });
      }
  };

  const handleScheduleChange = (scheduleId: string) => {
      setSelectedScheduleId(scheduleId);
      setSeatData(null);
      
      if (scheduleId) {
          setLoading(true);
          seatStatusService.getSeatStatusBySchedule(scheduleId)
            .then((data) => {
                setSeatData(data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
      }
  };

  // Derived Stats
  const stats = useMemo(() => {
    if (!seatData) return { total: 0, booked: 0, held: 0, available: 0 };
    return {
        total: seatData.totalSeats,
        booked: seatData.booked,
        held: seatData.held,
        available: seatData.available
    };
  }, [seatData]);

  // Prepare Options for Selects
  const routeOptions = useMemo(() => 
      routes.map(r => ({ value: r.id, label: `Tuyến ${r.id}: ${r.description}` })), 
  [routes]);

  const scheduleOptions = useMemo(() => 
      schedules.map(s => ({ 
          value: s.id, 
          label: `${new Date(s.departure_time).toLocaleString('vi-VN')} (${s.available_seats} chỗ trống)` 
      })), 
  [schedules]);

  // Map service status to UI Status
  const mapStatus = (status: 'AVAILABLE' | 'BOOKED' | 'HOLD'): SeatStatus => {
      if (status === 'HOLD') return 'HELD';
      return status; // 'AVAILABLE' | 'BOOKED' match
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Trạng thái ghế</h1>
          <p className="mt-1 text-sm text-slate-500">Giám sát trạng thái ghế theo chuyến xe</p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SelectField
              ariaLabel="Chọn tuyến đường"
              value={selectedRouteId}
              onChange={handleRouteChange}
              options={routeOptions}
              placeholder="-- Chọn Tuyến đường --"
            />
            <SelectField
              ariaLabel="Chọn chuyến xe"
              value={selectedScheduleId}
              onChange={handleScheduleChange}
              options={scheduleOptions}
              disabled={!selectedRouteId}
              placeholder="-- Chọn Chuyến xe --"
            />
          </div>
        </div>

         {loading && (
             <div className="flex justify-center p-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
             </div>
         )}

         {!loading && seatData && (
            <>
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    <StatCard label="Tổng ghế" value={stats.total} />
                    <StatCard label="Đã đặt" value={stats.booked} valueClassName="text-rose-600" />
                    <StatCard label="Đang giữ" value={stats.held} valueClassName="text-amber-600" />
                    <StatCard label="Còn trống" value={stats.available} valueClassName="text-emerald-600" />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
                        <div className="grid grid-cols-2 text-sm font-semibold text-slate-700">
                        <div>Ghế</div>
                        <div>Trạng thái</div>
                        </div>
                    </div>

                    <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {seatData.seats.filter(s => !!s.position.label).map((s) => (
                        <li key={s.position.id} className="px-6 py-4">
                            <div className="grid grid-cols-2 items-center">
                            <div className="text-sm font-medium text-slate-800">
                                {s.position.label}
                                {s.position.is_driver_seat && " (Tài xế)"}
                            </div>
                            <div>
                                <StatusPill status={mapStatus(s.status)} />
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>

                    {/* Footer hint */}
                    <div className="border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
                        Lịch trình: <span className="font-medium text-slate-700">{selectedScheduleId}</span>
                    </div>
                </div>
            </>
         )}

          {!loading && selectedScheduleId && !seatData && (
              <div className="text-center py-10 text-slate-500">
                  Không tìm thấy dữ liệu.
              </div>
          )}
      </div>
    </div>
  );
}
