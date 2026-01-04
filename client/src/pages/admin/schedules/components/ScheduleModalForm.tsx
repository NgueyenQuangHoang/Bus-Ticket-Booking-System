import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import type { ScheduleUI } from "./ScheduleTable";
import CustomSelect from "./CustomSelect";
import CustomDateTimePicker from "./CustomDateTimePicker";
import { validateSchedule } from "./validation";
import { cityService } from "../../../../services/cityService";
import { stationService } from "../../../../services/stationService";
import { routesService } from "../../../../services/routesService";
import busService from "../../../../services/admin/busService";
import type { City, Station, Route } from "../../../../types";
import type { Bus } from "../../../../types/bus";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ScheduleUI>) => void;
  initialData?: ScheduleUI | null;
  existingSchedules: ScheduleUI[];
};

const STATUS_OPTIONS = [
    { label: "Sẵn sàng (Available)", value: "AVAILABLE" },
    { label: "Đã đầy (Full)", value: "FULL" },
    { label: "Đã hủy (Cancelled)", value: "CANCELLED" },
];

export default function ScheduleModalForm({ open, onClose, onSubmit, initialData, existingSchedules }: Props) {
  const [formData, setFormData] = useState<Partial<ScheduleUI>>({
    route_id: 0,
    bus_id: 0,
    departure_time_str: "",
    total_seats: 40,
    available_seat: 40,
    status: "AVAILABLE",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Data Source States
  const [cities, setCities] = useState<City[]>([]);
  const [stationsFrom, setStationsFrom] = useState<Station[]>([]);
  const [stationsTo, setStationsTo] = useState<Station[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);

  // Selection States
  const [selectedCityFrom, setSelectedCityFrom] = useState<string | number | null>(null);
  const [selectedStationFrom, setSelectedStationFrom] = useState<string | number | null>(null);
  const [selectedCityTo, setSelectedCityTo] = useState<string | number | null>(null);
  const [selectedStationTo, setSelectedStationTo] = useState<string | number | null>(null);

  // Load Initial Data (Cities + Buses)
  useEffect(() => {
      const fetchData = async () => {
          try {
              const [citiesData, busesData] = await Promise.all([
                  cityService.getAllCities(),
                  busService.getAllBuses()
              ]);
              setCities(citiesData);
              setBuses(busesData);
          } catch (err) {
              console.error("Failed to load initial data", err);
          }
      };
      if (open) {
        fetchData();
      }
  }, [open]);

  // Load Initial Data Logic
  useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
      
      const loadInitialRouteInfo = async () => {
          if (!initialData.route_id) return;

          // 1. Get all routes to find the specific one (or get by ID if possible)
          // Since we don't have getRouteById in service yet, we can filter or use getAllRoutes
          // But actually, we need to know the STATIONS to pre-fill the dropdowns.
          try {
               const allRoutes = await routesService.getAllRoutes();
               // CASTING: route.id from backend might be string, initialData.route_id is number.
               // Compare loosely or convert.
               const currentRoute = allRoutes.find(r => String(r.id) === String(initialData.route_id));
               
               if (currentRoute) {
                   const depStationId = currentRoute.departure_station_id;
                   const arrStationId = currentRoute.arrival_station_id;

                   // 2. Fetch Stations Details to get their City IDs
                   // We need to fetch ALL stations or just specific ones? 
                   // stationService.getParticularStation takes number.
                   const depStation = await stationService.getParticularStation(Number(depStationId));
                   const arrStation = await stationService.getParticularStation(Number(arrStationId));

                   if (depStation && arrStation) {
                       // 3. Set Cities
                       setSelectedCityFrom(depStation.city_id);
                       setSelectedCityTo(arrStation.city_id);

                       // 4. Fetch Stations for those cities so dropdowns are populated
                       const stationsForCityFrom = await stationService.getStationsByCity(depStation.city_id);
                       const stationsForCityTo = await stationService.getStationsByCity(arrStation.city_id);
                       
                       setStationsFrom(stationsForCityFrom);
                       setStationsTo(stationsForCityTo);

                       // 5. Set Stations
                       setSelectedStationFrom(depStation.id);
                       setSelectedStationTo(arrStation.id);

                       // 6. Fetch Compatible Routes
                       const routes = await routesService.getRoutesByStations(depStation.id, arrStation.id);
                       setAvailableRoutes(routes);
                   }
               }
          } catch (err) {
              console.error("Failed to load initial route info", err);
          }
      };
      
      loadInitialRouteInfo();

    } else if (open) {
       // New Form Setup
       const now = new Date();
       const timePart = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
       const datePart = now.toLocaleDateString('en-GB');
       const timeStr = `${timePart} ${datePart}`;
       
       setFormData({
        route_id: 0,
        bus_id: 0,
        departure_time_str: timeStr,
        total_seats: 40,
        available_seat: 40,
        status: "AVAILABLE",
      });
      
      // Reset selections
      setSelectedCityFrom(null);
      setSelectedStationFrom(null);
      setSelectedCityTo(null);
      setSelectedStationTo(null);
      setStationsFrom([]);
      setStationsTo([]);
      setAvailableRoutes([]);
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field: keyof ScheduleUI, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // --- Handlers ---

  const handleBusChange = (val: string | number) => {
      handleChange("bus_id", val);
      // Auto-populate total_seats based on bus capacity
      const selectedBus = buses.find(b => String(b.id) === String(val));
      if (selectedBus && selectedBus.capacity) {
          setFormData(prev => ({ ...prev, total_seats: selectedBus.capacity }));
      }
  };

  const handleCityFromChange = async (val: string | number) => {
      setSelectedCityFrom(val);
      setSelectedStationFrom(null);
      setAvailableRoutes([]);
      setFormData(prev => ({ ...prev, route_id: 0 }));
      
      // Fetch stations for this city
      const stations = await stationService.getStationsByCity(val);
      setStationsFrom(stations);
  };

  const handleStationFromChange = async (val: string | number) => {
      setSelectedStationFrom(val);
      setFormData(prev => ({ ...prev, route_id: 0 }));
      
      if (selectedStationTo) {
          const routes = await routesService.getRoutesByStations(val, selectedStationTo);
          setAvailableRoutes(routes);
      }
  };

  const handleCityToChange = async (val: string | number) => {
      setSelectedCityTo(val);
      setSelectedStationTo(null);
      setAvailableRoutes([]);
      setFormData(prev => ({ ...prev, route_id: 0 }));
      
      const stations = await stationService.getStationsByCity(val);
      setStationsTo(stations);
  };

  const handleStationToChange = async (val: string | number) => {
      setSelectedStationTo(val);
      setFormData(prev => ({ ...prev, route_id: 0 }));
      
      if (selectedStationFrom) {
          const routes = await routesService.getRoutesByStations(selectedStationFrom, val);
          setAvailableRoutes(routes);
      }
  };

  const validate = (): boolean => {
      const newErrors = validateSchedule(formData, existingSchedules, initialData?.schedule_id);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const route = availableRoutes.find(r => String(r.id) === String(formData.route_id));
    const bus = buses.find(b => String(b.id) === String(formData.bus_id));
    
    let routeName = route?.description || "Tuyến xe";
    if (selectedStationFrom && selectedStationTo) {
        const dep = stationsFrom.find(s => String(s.id) === String(selectedStationFrom));
        const arr = stationsTo.find(s => String(s.id) === String(selectedStationTo));
        if (dep && arr) {
            routeName = `${dep.station_name} → ${arr.station_name}`;
        }
    }

    onSubmit({
        ...formData,
        route_name: routeName,
        bus_name: bus?.name,
        bus_license: bus?.license_plate,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl animate-modal-in my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? "Cập nhật lịch trình" : "Tạo lịch trình mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* --- Route Selection Flow --- */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                <h3 className="font-semibold text-slate-700">Chọn Lộ Trình</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. City From */}
                    <CustomSelect
                        label="Thành phố đi"
                        options={cities.map(c => ({ label: c.city_name, value: c.id }))}
                        value={selectedCityFrom || 0}
                        onChange={(val) => handleCityFromChange(val)}
                        placeholder="Chọn thành phố đi"
                    />
                    
                    {/* 2. Station From */}
                    <div className={!selectedCityFrom ? "opacity-50 pointer-events-none" : ""}>
                        <CustomSelect
                            label="Bến đi"
                            options={stationsFrom.map(s => ({ label: s.station_name, value: s.id }))}
                            value={selectedStationFrom || 0}
                            onChange={(val) => handleStationFromChange(val)}
                            placeholder="Chọn bến đi"
                        />
                    </div>
                    
                    {/* 3. City To */}
                    <CustomSelect
                        label="Thành phố đến"
                        options={cities.map(c => ({ label: c.city_name, value: c.id }))}
                        value={selectedCityTo || 0}
                        onChange={(val) => handleCityToChange(val)}
                        placeholder="Chọn thành phố đến"
                    />

                    {/* 4. Station To */}
                    <div className={!selectedCityTo ? "opacity-50 pointer-events-none" : ""}>
                         <CustomSelect
                            label="Bến đến"
                            options={stationsTo.map(s => ({ label: s.station_name, value: s.id }))}
                            value={selectedStationTo || 0}
                            onChange={(val) => handleStationToChange(val)}
                            placeholder="Chọn bến đến"
                        />
                    </div>
                </div>

                {/* Resulting Route Select */}
                <div className={(!selectedStationFrom || !selectedStationTo) ? "opacity-70" : ""}>
                    <CustomSelect
                        label="Tuyến xe phù hợp"
                        // Display Distance/Price info if available
                        options={availableRoutes.map(r => ({ 
                            label: `${r.distance ? r.distance + 'km' : ''} - ${r.base_price ? Number(r.base_price).toLocaleString() + 'đ' : ''} ${r.description ? '('+r.description.substring(0, 30)+'...)': ''}`, 
                            value: r.id 
                        }))}
                        value={formData.route_id || 0}
                        onChange={(val) => handleChange("route_id", val)}
                        placeholder={
                            !selectedStationFrom || !selectedStationTo 
                            ? "Vui lòng chọn đầy đủ bến đi và bến đến..." 
                            : availableRoutes.length === 0 
                                ? "Không tìm thấy tuyến xe phù hợp" 
                                : "Chọn tuyến xe"
                        }
                    />
                     {errors.route_id && <p className="text-red-500 text-xs mt-1 ml-1">{errors.route_id}</p>}
                </div>
            </div>

            <hr className="border-slate-100" />
            
            {/* --- Other Info --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Bus - Custom Select */}
            <div className="md:col-span-1">
                <CustomSelect
                    label="Xe"
                    options={buses.map(b => ({ label: `${b.name} - ${b.license_plate}`, value: b.id || "" }))}
                    value={formData.bus_id || 0}
                    onChange={(val) => handleBusChange(val)}
                    placeholder="Chọn xe"
                />
                {errors.bus_id && <p className="text-red-500 text-xs mt-1 ml-1">{errors.bus_id}</p>}
            </div>

            {/* Departure - Custom Date Picker */}
            <div className="md:col-span-1">
                <CustomDateTimePicker
                    label="Khởi hành"
                    value={formData.departure_time_str}
                    onChange={(val) => handleChange("departure_time_str", val)}
                />
                 {errors.departure_time_str && <p className="text-red-500 text-xs mt-1 ml-1">{errors.departure_time_str}</p>}
            </div>

            {/* Status - Custom Select */}
             <div className="md:col-span-1">
                <CustomSelect
                    label="Trạng thái"
                    options={STATUS_OPTIONS}
                    value={formData.status || "AVAILABLE"}
                    onChange={(val) => handleChange("status", val)}
                    placeholder="Chọn trạng thái"
                />
            </div>

             {/* Seats - Standard Inputs */}
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tổng ghế (Tự động)</label>
                <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all border-slate-300`}
                    value={formData.total_seats}
                    readOnly
                    disabled
                />
                 {errors.total_seats && <p className="text-red-500 text-xs mt-1 ml-1">{errors.total_seats}</p>}
            </div>

            {/* Available Seat Removed as per request */}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors hover:cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 hover:cursor-pointer"
            >
              {initialData ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
