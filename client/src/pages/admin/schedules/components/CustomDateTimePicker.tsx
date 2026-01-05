import { useState, useRef, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import { DayPicker } from "react-day-picker";
import { CalendarMonth, AccessTime } from "@mui/icons-material";
import "react-day-picker/style.css"; 

type Props = {
  label?: string;
  value?: string; // Format: "dd/MM/yyyy HH:mm:ss"
  onChange: (value: string) => void;
};

export default function CustomDateTimePicker({ label, value, onChange }: Props) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState("00:00");
  
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      try {
        const parsedDate = parse(value, "HH:mm dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
            setSelectedDate(parsedDate);
            setTimeValue(format(parsedDate, "HH:mm"));
        }
      } catch (e) {
        console.error("Date parse error", e);
      }
    }
  }, [value]);

  // Click outside to close Date Picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateContainerRef.current && !dateContainerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (timeContainerRef.current && !timeContainerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateDateTime(date, timeValue);
    setIsDatePickerOpen(false); // Auto close on select
  };

  const handleTimeSelect = (type: 'hour' | 'minute', val: number) => {
    const [h, m] = timeValue.split(':').map(Number);
    let newH = h;
    let newM = m;

    if (type === 'hour') newH = val;
    if (type === 'minute') newM = val;

    const newTimeStr = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    setTimeValue(newTimeStr);
    updateDateTime(selectedDate, newTimeStr);
  };

  const updateDateTime = (date: Date | undefined, time: string) => {
    const baseDate = date || new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);

    const formatted = format(newDate, "HH:mm dd/MM/yyyy");
    
    if (!date) {
        setSelectedDate(newDate);
    }
    
    onChange(formatted);
  };

  // Generate lists for dropdown
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      
      <div className="flex items-start gap-2">
        {/* DATE INPUT */}
        <div className="relative flex-1 w-full" ref={dateContainerRef}>
            <div 
                className="
                    flex items-center gap-2 
                    w-full px-3 py-2 
                    border border-slate-300 rounded-lg 
                    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
                    transition-all bg-white cursor-pointer
                "
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            >
                <CalendarMonth className="text-slate-400" sx={{ fontSize: 20 }} />
                <input 
                    readOnly
                    className="flex-1 outline-none text-slate-700 bg-transparent cursor-pointer w-[100px]"
                    placeholder="Chọn ngày..."
                    value={selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
                />
            </div>

            {isDatePickerOpen && (
                <div className="absolute z-[60] top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-xl shadow-xl animate-dropdown-expand">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        modifiersClassNames={{
                            selected: 'bg-blue-600 text-white rounded-full',
                            today: 'text-blue-600 font-bold'
                        }}
                        styles={{
                            head_cell: { width: '40px', color: '#64748b' },
                            cell: { width: '40px' },
                            day: { width: '40px', height: '40px' },
                            nav_button: { color: '#64748b' },
                            caption: { color: '#1e293b' }
                        }}
                    />
                </div>
            )}
        </div>

        {/* TIME INPUT (Custom Dropdown) */}
        <div className="relative w-32" ref={timeContainerRef}>
             <div 
                className="
                    flex items-center gap-2 
                    w-full px-3 py-2 
                    border border-slate-300 rounded-lg 
                    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
                    transition-all bg-white cursor-pointer
                "
                onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
             >
                <AccessTime className="text-slate-400" sx={{ fontSize: 20 }} />
                <span className="flex-1 text-slate-700">{timeValue}</span>
             </div>

             {isTimePickerOpen && (
                 <div className="absolute z-[60] top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl animate-dropdown-expand flex h-48 overflow-hidden w-40">
                    {/* Hours Column */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-slate-100">
                        <div className="px-2 py-1 text-xs font-bold text-slate-400 bg-slate-50 sticky top-0">Giờ</div>
                        {hours.map(h => (
                            <button
                                key={h}
                                type="button"
                                className={`
                                    w-full px-3 py-1 text-center text-sm
                                    hover:bg-blue-50 hover:text-blue-600
                                    ${Number(timeValue.split(':')[0]) === h ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}
                                `}
                                onClick={() => handleTimeSelect('hour', h)}
                            >
                                {String(h).padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                    {/* Minutes Column */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="px-2 py-1 text-xs font-bold text-slate-400 bg-slate-50 sticky top-0">Phút</div>
                        {minutes.map(m => (
                            <button
                                key={m}
                                type="button"
                                className={`
                                    w-full px-3 py-1 text-center text-sm
                                    hover:bg-blue-50 hover:text-blue-600
                                    ${Number(timeValue.split(':')[1]) === m ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}
                                `}
                                onClick={() => handleTimeSelect('minute', m)}
                            >
                                {String(m).padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
}
