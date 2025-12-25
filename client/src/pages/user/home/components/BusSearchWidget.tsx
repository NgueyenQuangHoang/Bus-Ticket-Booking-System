import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import "react-day-picker/dist/style.css";

import type { RootState, AppDispatch } from "../../../../store";
import { fetchCities } from "../../../../slices/citySlice";
import type { City } from "../../../../types";

// --- TYPE ---
interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: City[];
  placeholder?: string;
  loading?: boolean;
  excludeCity?: string; // City name to exclude from options
}

// --- COMPONENT CON: CUSTOM SELECT ---
const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  loading = false,
  excludeCity = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tìm city name từ value (city_id hoặc city_name)
  const selectedCity = options.find(city => city.city_name === value);
  const displayValue = selectedCity?.city_name || value;

  // Filter options: loại bỏ thành phố đã chọn ở dropdown khác và filter theo search term
  const filteredOptions = options.filter(city => {
    // Loại bỏ thành phố đã chọn ở dropdown khác
    if (excludeCity && city.city_name === excludeCity) return false;
    // Filter theo search term (tìm tương đối - chứa ký tự, không phân biệt hoa thường)
    if (searchTerm) {
      return city.city_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search khi đóng
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus vào input khi mở dropdown
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative xl:w-[330px] w-full h-[90px] border rounded-[6px] bg-white/90 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors select-none
        ${isOpen
          ? "border-black bg-white"
          : "border-[#9E9E9E] hover:border-gray-600 hover:bg-gray-100"
        }
      `}
      onClick={() => !loading && setIsOpen(!isOpen)}
    >
      {/* Label */}
      <label className="font-bold text-[14px] leading-[19px] text-[#565656] text-center cursor-pointer">
        {label}
      </label>

      {/* Value hiển thị */}
      <div className="flex items-center gap-2">
        {loading ? (
          <span className="text-[14.6px] leading-[19px] text-[#757575]">
            Đang tải...
          </span>
        ) : (
          <span
            className={`text-[14.6px] leading-[19px] ${displayValue ? "text-black font-medium" : "text-[#757575]"
              }`}
          >
            {displayValue || placeholder}
          </span>
        )}
        {/* Mũi tên dropdown */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* --- PHẦN DANH SÁCH XỔ XUỐNG --- */}
      {isOpen && !loading && (
        <div
          className="absolute top-[105%] left-0 w-full max-h-[350px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ô tìm kiếm */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Gõ để tìm nhanh..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-orange-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Danh sách options */}
          <div className="max-h-[280px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchTerm ? `Không tìm thấy "${searchTerm}"` : "Không có dữ liệu"}
              </div>
            ) : (
              filteredOptions.map((city) => (
                <div
                  key={city.city_id}
                  className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center transition-colors
                    ${city.city_name === value
                      ? "bg-orange-50 text-[#FFA901] font-bold" // Đã chọn
                      : "text-gray-700 hover:bg-orange-100 hover:text-[#FFA901]" // Hover
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(city.city_name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {city.city_name}
                  {city.city_name === value && <Check className="w-4 h-4" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export default function BusSearchWidget() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cities, loading } = useSelector((state: RootState) => state.city);

  const [departure, setDeparture] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Fetch cities khi component mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Ref click outside cho Calendar
  const calendarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    // Kiểm tra đã chọn đủ thông tin chưa
    if (!departure || !destination) {
      alert("Vui lòng chọn điểm khởi hành và điểm đến!");
      return;
    }

    // Tạo query params
    const params = new URLSearchParams();
    params.set("from", departure);
    params.set("to", destination);
    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    }

    // Navigate đến trang BookingTicket với query params
    navigate(`/bookingTicket?${params.toString()}`);
  };

  // Sắp xếp cities theo tên
  const sortedCities = [...cities].sort((a, b) =>
    a.city_name.localeCompare(b.city_name, 'vi')
  );

  return (
    <div className="font-['Segoe_UI'] w-full flex justify-center">
      <div
        className="w-[1200px] max-w-full min-h-[209px] rounded-[10px] p-[15px] pb-[32px] pt-[30px] flex flex-col gap-[20px] backdrop-blur-sm shadow-sm"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
      >
        <div
          // --- PHẦN CHỈNH SỬA Ở ĐÂY ---
          // 1. h-auto: Chiều cao tự động co giãn khi xếp dọc
          // 2. xl:h-[147px]: Chỉ cố định chiều cao khi màn hình RẤT LỚN (trên 1280px)
          // 3. flex-col: Mặc định là xếp dọc (cho mobile, iPad)
          // 4. xl:flex-row: Chỉ xếp ngang khi màn hình trên 1280px
          className="w-full h-auto xl:h-[147px]  border border-[#E0E0E0] rounded-[6px] flex flex-col xl:flex-row items-center justify-center gap-4 relative p-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
        >
          {/* 1. ĐIỂM KHỞI HÀNH (Dùng Custom Select) */}
          <CustomSelect
            label="Điểm Khởi Hành"
            value={departure}
            onChange={setDeparture}
            options={sortedCities}
            placeholder="Chọn điểm khởi hành"
            loading={loading}
            excludeCity={destination}
          />

          {/* 2. ĐIỂM ĐẾN (Dùng Custom Select) */}
          <CustomSelect
            label="Điểm Đến"
            value={destination}
            onChange={setDestination}
            options={sortedCities}
            placeholder="Chọn điểm đến"
            loading={loading}
            excludeCity={departure}
          />

          {/* 3. NGÀY KHỞI HÀNH */}
          <div
            ref={calendarRef}
            className={`relative xl:w-[330px] w-full h-[90px] border rounded-[6px] bg-white/60 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors select-none
              ${isCalendarOpen
                ? "border-black bg-white"
                : "border-[#9E9E9E] hover:border-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <label className="font-bold text-[14px] leading-[19px] text-[#565656] text-center cursor-pointer">
              Ngày Khởi Hành
            </label>
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-[16px] h-[16px] text-[#292D32]" />
              <span
                className={`text-[14.6px] leading-[19px] ${date ? "text-black font-medium" : "text-[#757575]"
                  }`}
              >
                {date
                  ? format(date, "dd/MM/yyyy", { locale: enUS })
                  : "Chọn ngày khởi hành"}
              </span>
            </div>

            {/* Popup Calendar */}
            {isCalendarOpen && (
              <div
                className="absolute top-[105%]  z-50  bg-white shadow-xl rounded-lg border border-gray-200 p-2 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setIsCalendarOpen(false);
                  }}
                  locale={enUS}
                  disabled={{ before: new Date() }}
                  modifiersClassNames={{
                    selected:
                      "bg-[#FFA901] text-white hover:bg-[#e59800] rounded-full font-bold",
                    today: "text-[#FFA901] font-bold",
                    disabled:
                      "text-gray-200 cursor-not-allowed hover:bg-transparent hover:text-gray-200 decoration-gray-300",
                  }}
                  classNames={{
                    day: "rounded-full hover:bg-orange-100 hover:text-[#FFA901] transition-colors cursor-pointer text-sm",
                  }}
                />
              </div>
            )}
          </div>

          {/* 4. BUTTON SEARCH */}
          <button
            onClick={handleSearch}
            className="xl:w-[266px] w-full h-[90px] rounded-[6px] flex items-center justify-center gap-[12px] hover:opacity-90 transition-opacity active:scale-95 bg-[#FFA901] shadow-md hover:cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <Search className="w-[24px] h-[24px] text-white stroke-[3px]" />
            </div>
            <span className="font-bold text-[15px] leading-[17px] text-white tracking-[0.45px]">
              TÌM CHUYẾN XE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
