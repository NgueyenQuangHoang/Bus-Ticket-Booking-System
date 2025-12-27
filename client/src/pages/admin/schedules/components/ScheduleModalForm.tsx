import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import type { ScheduleUI } from "./ScheduleTable";
import CustomSelect from "./CustomSelect";
import CustomDateTimePicker from "./CustomDateTimePicker";
import { validateSchedule } from "./validation";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ScheduleUI>) => void;
  initialData?: ScheduleUI | null;
  existingSchedules: ScheduleUI[];
};

// Mock data for selections
const ROUTES = [
  { id: 101, name: "Bến xe Miền Đông → Bến xe Mỹ Đình" },
  { id: 102, name: "Bến xe Miền Đông → Bến xe Giáp Bát" },
  { id: 103, name: "Bến xe Miền Tây → Bến xe Mỹ Đình" },
];

const BUSES = [
  { id: 201, name: "FUTA-VIP01", license: "51B-12345" },
  { id: 202, name: "FUTA-VIP02", license: "51B-67890" },
  { id: 203, name: "HL-001", license: "29B-99999" },
];

const STATUS_OPTIONS = [
    { label: "Sẵn sàng (Available)", value: "AVAILABLE" },
    { label: "Đã đầy (Full)", value: "FULL" },
    { label: "Đã hủy (Cancelled)", value: "CANCELLED" },
];

export default function ScheduleModalForm({ open, onClose, onSubmit, initialData, existingSchedules }: Props) {
  const [formData, setFormData] = useState<Partial<ScheduleUI>>({
    route_id: 0,
    bus_id: 0,
    departure_time_str: "", // Default empty
    total_seats: 40,
    available_seat: 40,
    status: "AVAILABLE",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Set default time to something valid for the picker to parse if new
       const now = new Date();
       // Format as HH:mm dd/MM/yyyy (Manual or using options to ensure no seconds)
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
    }
    setErrors({}); // Reset errors on open
  }, [initialData, open]);

  const handleChange = (field: keyof ScheduleUI, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user changes the field
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const validate = (): boolean => {
      const newErrors = validateSchedule(formData, existingSchedules, initialData?.schedule_id);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
        return;
    }
    
    // Resolve names for UI (Mock logic)
    const route = ROUTES.find(r => r.id === formData.route_id);
    const bus = BUSES.find(b => b.id === formData.bus_id);
    
    onSubmit({
        ...formData,
        route_name: route?.name,
        bus_name: bus?.name,
        bus_license: bus?.license,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? "Cập nhật lịch trình" : "Tạo lịch trình mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route - Custom Select */}
            <div className="md:col-span-1">
                <CustomSelect
                    label="Tuyến xe"
                    options={ROUTES.map(r => ({ label: r.name, value: r.id }))}
                    value={formData.route_id || 0}
                    onChange={(val) => handleChange("route_id", Number(val))}
                    placeholder="Chọn tuyến xe"
                />
                {errors.route_id && <p className="text-red-500 text-xs mt-1 ml-1">{errors.route_id}</p>}
            </div>

            {/* Bus - Custom Select */}
            <div className="md:col-span-1">
                <CustomSelect
                    label="Xe"
                    options={BUSES.map(b => ({ label: `${b.name} - ${b.license}`, value: b.id }))}
                    value={formData.bus_id || 0}
                    onChange={(val) => handleChange("bus_id", Number(val))}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Tổng ghế</label>
                <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.total_seats ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.total_seats}
                    onChange={(e) => handleChange("total_seats",e.target.value)}
                />
                 {errors.total_seats && <p className="text-red-500 text-xs mt-1 ml-1">{errors.total_seats}</p>}
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghế trống</label>
                <input
                    type="text"
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.available_seat ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.available_seat}
                    onChange={(e) => handleChange("available_seat",e.target.value)}
                />
                 {errors.available_seat && <p className="text-red-500 text-xs mt-1 ml-1">{errors.available_seat}</p>}
            </div>
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
