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
import { getStoredBusCompanyId, getStoredRole } from "../../../../utils/authStorage";

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
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-full">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          "w-full appearance-none rounded-xl border border-slate-200 bg-white",
          "px-4 py-3 pr-10 text-sm text-slate-700",
          "outline-none",
          "focus:border-slate-300 focus:ring-4 focus:ring-slate-100",
          "disabled:bg-slate-100 disabled:text-slate-400"
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
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  const [allBusCompanies, setAllBusCompanies] = useState<BusCompany[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedBusId, setSelectedBusId] = useState<string>("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [seatData, setSeatData] = useState<{
      seats: SeatStatusData[];
      totalSeats: number;
      booked: number;
      held: number;
      available: number;
  } | null>(null);

  // 1. Fetch All Data on Mount
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [routesData, companiesData, stationsData, schedulesData, busesData] = await Promise.all([
                seatStatusService.getRoutes(),
                seatStatusService.getBusCompanies(),
                stationService.getAllStations(),
                seatStatusService.getAllSchedules(),
                seatStatusService.getAllBuses()
            ]);
            setRoutes(routesData);
            setAllBusCompanies(companiesData);
            setStations(stationsData);
            setAllSchedules(schedulesData);
            setAllBuses(busesData);
        } catch (error) {
            console.error("Error fetching initial data", error);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isBusCompany && busCompanyId) {
      setSelectedCompanyId(busCompanyId);
    }
  }, [isBusCompany, busCompanyId]);

  // 2. Compute Filtered Options
  const { validCompanyOptions, validBusOptions, scheduleOptions } = useMemo(() => {
      if (isBusCompany && !busCompanyId) {
        return {
          validCompanyOptions: [],
          validBusOptions: [],
          scheduleOptions: [],
        };
      }
      const now = new Date();
      const companyFilterId = isBusCompany && busCompanyId ? busCompanyId : selectedCompanyId;
      
      // Filter Active Schedules
      const activeSchedules = allSchedules.filter(s => new Date(s.departure_time) >= now);

      // Unique Bus IDs with active schedules
      const activeBusIds = new Set(activeSchedules.map(s => s.bus_id));

      // Filtered Buses (must have active schedule)
      const validBuses = allBuses
        .filter(b => activeBusIds.has(b.id))
        .filter(b => {
          if (!companyFilterId) return true;
          return String(b.bus_company_id) === String(companyFilterId);
        });
      
      // Unique Company IDs from valid buses
      const activeCompanyIds = new Set(validBuses.map(b => b.bus_company_id));

      // 1. Company Options
      const companyOpts = allBusCompanies
          .filter(c => activeCompanyIds.has(c.id))
          .filter(c => {
            if (!companyFilterId) return true;
            return String(c.id) === String(companyFilterId);
          })
          .map(c => ({ value: c.id, label: c.company_name }));

      // 2. Bus Options (Dependent on selected Company)
      const busOpts = validBuses
          .filter(b => !companyFilterId || String(b.bus_company_id) === String(companyFilterId))
          .map(b => ({ value: b.id, label: b.name }));

      // 3. Schedule Options (Dependent on selected Bus)
      // Showing active schedules for the selected bus
      const busSchedules = activeSchedules.filter(s => s.bus_id === selectedBusId);
      
      // Helper maps for labels
      const stationMap = new Map(stations.map(s => [String(s.id), s.station_name]));
      const routeMap = new Map(routes.map(r => [String(r.id), r]));

      const scheduleOpts = busSchedules.map(s => {
          const route = routeMap.get(String(s.route_id));
          
          let routeLabel = "Unknown Route";
          if (route) {
              const from = stationMap.get(String(route.departure_station_id)) || "?";
              const to = stationMap.get(String(route.arrival_station_id)) || "?";
              routeLabel = `${from} → ${to}`;
          }

          const time = new Date(s.departure_time).toLocaleString('vi-VN', {
              hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
          });

          return {
              value: s.id,
              label: `${time} | ${routeLabel}`
          };
      });

      // Sort schedules by time
      scheduleOpts.sort((a, b) => a.label.localeCompare(b.label));

      return {
          validCompanyOptions: companyOpts,
          validBusOptions: busOpts,
          scheduleOptions: scheduleOpts
      };

  }, [allSchedules, allBuses, allBusCompanies, selectedCompanyId, selectedBusId, stations, routes, isBusCompany, busCompanyId]);


  // Handlers
  const handleCompanyChange = (companyId: string) => {
      if (isBusCompany) return;
      setSelectedCompanyId(companyId);
      setSelectedBusId("");
      setSelectedScheduleId("");
      setSeatData(null);
  };

  const handleBusChange = (busId: string) => {
      setSelectedBusId(busId);
      setSelectedScheduleId("");
      setSeatData(null);
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

  // Map service status to UI Status
  const mapStatus = (status: 'AVAILABLE' | 'BOOKED' | 'HOLD'): SeatStatus => {
      if (status === 'HOLD') return 'HELD';
      return status;
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SelectField
              ariaLabel="Chọn nhà xe"
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              options={[{ value: "", label: "-- Chọn Nhà xe --" }, ...validCompanyOptions]}
              disabled={isBusCompany}
            />
            <SelectField
              ariaLabel="Chọn loại xe"
              value={selectedBusId}
              onChange={handleBusChange}
              options={[{ value: "", label: "-- Chọn Xe --" }, ...validBusOptions]}
              disabled={!selectedCompanyId && validCompanyOptions.length > 0} 
            />
              {/* Note: I removed disabled check for just company selected, allowing to see all valid buses if no company selected is also an option, but typical flow is hierarchical. Actually my filter logic allows specific bus select even if filtering by company. But let's keep it simple. */}
             <SelectField
              ariaLabel="Chọn chuyến xe"
              value={selectedScheduleId}
              onChange={handleScheduleChange}
              options={[{ value: "", label: "-- Chọn Chuyến xe --" }, ...scheduleOptions]}
              disabled={!selectedBusId}
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
