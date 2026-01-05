import { useState, useMemo, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";

import ScheduleTable, { type ScheduleUI } from "./components/ScheduleTable";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleSearch from "./components/ScheduleSearch";
import ScheduleModalForm from "./components/ScheduleModalForm";
import { scheduleService } from "../../../services/scheduleService";
import { routesService } from "../../../services/routesService";
import busService from "../../../services/admin/busService";
import { stationService } from "../../../services/stationService";
import { seatStatusService } from "../../../services/seatStatusService";
import { getStoredBusCompanyId, getStoredRole } from "../../../utils/authStorage";

export default function SchedulesPage() {
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  // Data State
  const [data, setData] = useState<ScheduleUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allRoutes, setAllRoutes] = useState<any[]>([]); // Store routes for duration lookup

  // Pagination State
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  // Modal State
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleUI | null>(null);

  // Fetch Data
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [schedulesRes, routesRes, busesRes, stationsRes] = await Promise.all([
        scheduleService.getAllSchedules(),
        routesService.getAllRoutes(),
        busService.getAllBuses(),
        stationService.getAllStations()
      ]);

      const schedules = Array.isArray(schedulesRes) ? schedulesRes : [];
      const routes = Array.isArray(routesRes) ? routesRes : [];
      const buses = Array.isArray(busesRes) ? busesRes : [];
      const stations = Array.isArray(stationsRes) ? stationsRes : [];

      setAllRoutes(routes); // Save routes for duration calculation

      // Create Lookups
      const routeMap = new Map(routes.map(r => [String(r.id), r]));
      const busMap = new Map(buses.map(b => [String(b.id ?? b.bus_id), b]));
      const stationMap = new Map(stations.map(s => [String(s.id), s.station_name]));
      // ... (Rest of Enrich Data logic)

      const scopedSchedules = isBusCompany
        ? (busCompanyId
            ? schedules.filter((item) => {
                const bus = busMap.get(String(item.bus_id));
                const companyId =
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (bus as any)?.bus_company_id ?? (bus as any)?.company_id;
                return companyId && String(companyId) === String(busCompanyId);
              })
            : [])
        : schedules;

        // Enrich Data + pull live seat status per schedule to get accurate available/total
        const enrichedData = await Promise.all(scopedSchedules.map(async item => {
        const route = routeMap.get(String(item.route_id));
        const bus = busMap.get(String(item.bus_id));
        
        let routeName = "Tuyến chưa xác định";
        if (route) {
          if (route.departure_station_id && route.arrival_station_id) {
             const dep = stationMap.get(String(route.departure_station_id));
             const arr = stationMap.get(String(route.arrival_station_id));
             if (dep && arr) {
               routeName = `${dep} → ${arr}`;
             } else {
               routeName = route.description || `Route #${item.route_id}`;
             }
          } else {
             routeName = route.description || `Route #${item.route_id}`;
          }
        }
        
        let timeStr = "";
        if (item.departure_time) {
          try {
            const dateObj = new Date(item.departure_time);
            if (!isNaN(dateObj.getTime())) {
              const hh = String(dateObj.getHours()).padStart(2, '0');
              const mm = String(dateObj.getMinutes()).padStart(2, '0');
              const dd = String(dateObj.getDate()).padStart(2, '0');
              const Mo = String(dateObj.getMonth() + 1).padStart(2, '0');
              const yyyy = dateObj.getFullYear();
              timeStr = `${hh}:${mm} ${dd}/${Mo}/${yyyy}`;
            }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            console.warn("Invalid date", item.departure_time);
          }
        }

        // Default from API fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let availableSeat = (item as any).available_seats !== undefined ? (item as any).available_seats : item.available_seat;
        let totalSeats = item.total_seats;

        // Fetch live seat status; fallback gracefully on error
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stats = await seatStatusService.getSeatStatusBySchedule(String(item.schedule_id));
          availableSeat = stats.available;
          totalSeats = stats.totalSeats;
        } catch (err) {
          console.warn("Failed to fetch seat status for schedule", item.schedule_id, err);
        }

        return {
          ...item,
          route_name: routeName,
          bus_name: bus ? bus.name : `Bus #${item.bus_id}`,
          bus_license: bus ? bus.license_plate : "",
          departure_time_str: timeStr,
          available_seat: availableSeat,
          total_seats: totalSeats,

        };
        }));

      setData(enrichedData);
    } catch (error) {
      console.error("Failed to fetch schedules details", error);
      Swal.fire("Lỗi!", "Không thể tải danh sách lịch trình đầy đủ.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DEPARTED' | 'NOT_DEPARTED'>('ALL');

  // ... (existing fetchSchedules)

  // --- DERIVED DATA ---
  const filteredData = useMemo(() => {
    const now = new Date();
    return data.filter(item => {
      // 1. Search Term
      const matchesSearch = 
        item.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bus_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Status Filter
      if (filterStatus === 'ALL') return true;

      // Safe date parsing
      const timeStr = item.departure_time; 
      if (!timeStr) return false;

      const depTime = new Date(timeStr);
      // Check for Invalid Date
      if (isNaN(depTime.getTime())) return false; 

      if (filterStatus === 'DEPARTED') {
          return depTime <= now;
      } else {
          // NOT_DEPARTED (Pending)
          return depTime > now;
      }
    });
  }, [data, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE) || 1;
  
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, page]);

  // --- HANDLERS ---

  // Create / Edit
  const handleOpenCreate = () => {
    setEditingItem(null);
    setOpenFormModal(true);
  };

  const handleOpenEdit = (item: ScheduleUI) => {
    setEditingItem(item);
    setOpenFormModal(true);
  };

  const handleFormSubmit = async (formData: Partial<ScheduleUI>) => {
    try {
        // --- DATA TRANSFORMATION ---
        // 1. Convert departure_time_str (HH:mm dd/MM/yyyy) -> departure_time (ISO)
        let isoDate = "";
        let arrivalIsoDate = "";

        if (formData.departure_time_str) {
            const [time, date] = formData.departure_time_str.split(" ");
            const [hh, mm] = time.split(":");
            const [dd, Mo, yyyy] = date.split("/");
            // Construct ISO string: YYYY-MM-DDTHH:mm:00.000Z (or local)
            const d = new Date(Number(yyyy), Number(Mo) - 1, Number(dd), Number(hh), Number(mm));
            isoDate = `${yyyy}-${Mo}-${dd}T${hh}:${mm}`;

            // Calculate Arrival Time if route duration exists
            const route = allRoutes.find(r => String(r.id) === String(formData.route_id));
            if (route && route.duration) {
                // Duration is in minutes (based on db.json checks, e.g. 1800mins)
                const arrivalDate = new Date(d.getTime() + (Number(route.duration) * 60000));
                
                const ah = String(arrivalDate.getHours()).padStart(2, '0');
                const am = String(arrivalDate.getMinutes()).padStart(2, '0');
                const ad = String(arrivalDate.getDate()).padStart(2, '0');
                const aM = String(arrivalDate.getMonth() + 1).padStart(2, '0');
                const ay = arrivalDate.getFullYear();
                arrivalIsoDate = `${ay}-${aM}-${ad}T${ah}:${am}`;
            }
        }

        // 2. Prepare payload for API needs to be complete
        const submitData = {
            route_id: formData.route_id,
            bus_id: formData.bus_id,
            total_seats: formData.total_seats,
            available_seats: formData.available_seat, 
            status: formData.status,
            departure_time: isoDate,
            arrival_time: arrivalIsoDate,
             updated_at: new Date().toISOString(),
        };

        if (editingItem) {
            // Update existing
            await scheduleService.updateSchedule(editingItem.schedule_id, submitData);
            Swal.fire("Thành công!", "Đã cập nhật lịch trình.", "success");
        } else {
            // Create new
            const createPayload = {
                ...submitData,
                created_at: new Date().toISOString(),
            };
            await scheduleService.createSchedule(createPayload);
            Swal.fire("Thành công!", "Đã thêm mới lịch trình.", "success");
        }
        setOpenFormModal(false);
        fetchSchedules(); // Refresh data
    } catch (error) {
        console.error("Failed to save schedule", error);
        Swal.fire("Lỗi!", "Có lỗi xảy ra khi lưu dữ liệu.", "error");
    }
  };

  // Delete (using SweetAlert2)
  const handleDelete = (item: ScheduleUI) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc chắn muốn xóa lịch trình #${item.schedule_id} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa bỏ",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            await scheduleService.deleteSchedule(item.schedule_id);
            Swal.fire("Đã xóa!", "Lịch trình đã được xóa thành công.", "success");
            fetchSchedules(); // Refresh data
        } catch (error) {
            console.error("Failed to delete schedule", error);
             Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
       <ScheduleHeader 
         totalCount={filteredData.length} 
         onAddClick={handleOpenCreate} 
       />

       <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-full md:w-1/2">
                <ScheduleSearch 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                />
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Trạng thái:</span>
                <select
                    value={filterStatus}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white hover:cursor-pointer"
                >
                    <option value="ALL">Tất cả chuyến</option>
                    <option value="NOT_DEPARTED">Sắp khởi hành (Chưa đi)</option>
                    <option value="DEPARTED">Đã khởi hành (Đã đi)</option>
                </select>
            </div>
       </div>

       {/* Loading State or Table */}
        {loading ? (
             <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
        ) : (
            <>
                <ScheduleTable
                    data={paginatedData}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination */}
                <div className="flex justify-end pt-4">
                    <Stack spacing={2}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                        shape="rounded"
                        showFirstButton 
                        showLastButton
                    />
                    </Stack>
                </div>
            </>
        )}

      {/* Form Modal */}
      <ScheduleModalForm
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        existingSchedules={data}
      />
    </div>
  );
}
