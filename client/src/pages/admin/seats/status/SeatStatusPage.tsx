import React, { useMemo, useState, useEffect } from "react";
import { 
    seatStatusService, 
    type Route, 
    type Schedule, 
    type SeatStatusData,
    type Bus,
    type BusCompany
} from "../../../../services/seatStatusService";
import { stationService } from "../../../../services/stationService";
import type { Station } from "../../../../types/station";

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
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="relative w-full">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full appearance-none rounded-xl border border-slate-200 bg-white",
          "px-4 py-3 pr-10 text-sm text-slate-700",
          "outline-none",
          "focus:border-slate-300 focus:ring-4 focus:ring-slate-100",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-400">
          <path fill="currentColor" d="M7 10l5 5l5-5H7z" />
        </svg>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function SeatStatusPage() {
  const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedBusId, setSelectedBusId] = useState<string>("");
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

  // 1. Fetch Companies and Routes on Mount
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [routesData, companiesData, stationsData] = await Promise.all([
                seatStatusService.getRoutes(),
                seatStatusService.getBusCompanies(),
                stationService.getAllStations()
            ]);
            setRoutes(routesData);
            setBusCompanies(companiesData);
            setStations(stationsData);
        } catch (error) {
            console.error("Error fetching initial data", error);
        }
    };
    fetchData();
  }, []);

  // Handlers
  const handleCompanyChange = (companyId: string) => {
      setSelectedCompanyId(companyId);
      // Reset dependents
      setBuses([]);
      setSelectedBusId("");
      setSchedules([]);
      setSelectedScheduleId("");
      setSeatData(null);

      if (companyId) {
          seatStatusService.getBusesByCompany(companyId).then(setBuses);
      }
  };

  const handleBusChange = (busId: string) => {
      setSelectedBusId(busId);
      updateSchedules(busId, selectedRouteId);
      setSelectedScheduleId("");
      setSeatData(null);
  };

  const handleRouteChange = (routeId: string) => {
      setSelectedRouteId(routeId);
      updateSchedules(selectedBusId, routeId);
      setSelectedScheduleId("");
      setSeatData(null);
  };

  const updateSchedules = (busId: string, routeId: string) => {
      setSchedules([]);
      if (busId && routeId) {
          // If both selected, fetch by Bus and filter by Route (or vice versa)
          seatStatusService.getSchedulesByBus(busId).then(data => {
              const filtered = data.filter(s => s.route_id === routeId);
              setSchedules(filtered);
          });
      } else if (busId) {
          seatStatusService.getSchedulesByBus(busId).then(setSchedules);
      } else if (routeId) {
          seatStatusService.getSchedulesByRoute(routeId).then(setSchedules);
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

  // Options
  const companyOptions = useMemo(() => 
    busCompanies.map(c => ({ value: c.id, label: c.company_name })), 
  [busCompanies]);

  const busOptions = useMemo(() => 
    buses.map(b => ({ value: b.id, label: b.name })), 
  [buses]);

  const routeOptions = useMemo(() => {
    const stationMap = new Map(stations.map(s => [String(s.id), s.station_name]));
    return routes.map((r, i) => {
        const from = stationMap.get(String(r.departure_station_id)) || "?";
        const to = stationMap.get(String(r.arrival_station_id)) || "?";
        return { 
            value: r.id, 
            label: `Tuyến ${i + 1}: ${from} → ${to}` 
        };
    });
  }, [routes, stations]);

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
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SelectField
              ariaLabel="Chọn nhà xe"
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              options={[{ value: "", label: "-- Chọn Nhà xe --" }, ...companyOptions]}
            />
            <SelectField
              ariaLabel="Chọn loại xe"
              value={selectedBusId}
              onChange={handleBusChange}
              options={[{ value: "", label: "-- Chọn Xe --" }, ...busOptions]}
            />
            <SelectField
              ariaLabel="Chọn tuyến đường"
              value={selectedRouteId}
              onChange={handleRouteChange}
              options={[{ value: "", label: "-- Chọn Tuyến đường --" }, ...routeOptions]}
            />
             <SelectField
              ariaLabel="Chọn chuyến xe"
              value={selectedScheduleId}
              onChange={handleScheduleChange}
              options={[{ value: "", label: "-- Chọn Chuyến xe --" }, ...scheduleOptions]}
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
                        <div className="grid grid-cols-12 text-sm font-semibold text-slate-700">
                            <div className="col-span-3">Ghế</div>
                            <div className="col-span-3">Trạng thái</div>
                            <div className="col-span-6">Ghi chú</div>
                        </div>
                    </div>

                    <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {seatData.seats.filter(s => !!s.position.label).map((s) => (
                        <li key={s.position.id} className="px-6 py-4">
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-span-3 text-sm font-medium text-slate-800">
                                    {s.position.label}
                                    {s.position.is_driver_seat && " (Tài xế)"}
                                </div>
                                <div className="col-span-3">
                                    <StatusPill status={mapStatus(s.status)} />
                                </div>
                                <div className="col-span-6 text-sm text-slate-500 break-words">
                                    {s.note || "-"}
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
