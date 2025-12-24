/**
 * Component: AreaCodeSelect
 * Mục đích: Cung cấp danh sách thả xuống để chọn mã vùng quốc gia cho số điện thoại.
 * Tính năng:
 *  - Hiển thị cờ và mã vùng đã chọn.
 *  - Danh sách thả xuống các mã vùng có sẵn.
 */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import CheckIcon from "@mui/icons-material/Check";

// --- DATA: Danh sách mã vùng ---
export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  label: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "+84", country: "VN", flag: "🇻🇳", label: "Việt Nam" },
  { code: "+1", country: "US", flag: "🇺🇸", label: "Hoa Kỳ" },
  { code: "+81", country: "JP", flag: "🇯🇵", label: "Nhật Bản" },
  { code: "+82", country: "KR", flag: "🇰🇷", label: "Hàn Quốc" },
  { code: "+66", country: "TH", flag: "🇹🇭", label: "Thái Lan" },
  { code: "+65", country: "SG", flag: "🇸🇬", label: "Singapore" },
  { code: "+86", country: "CN", flag: "🇨🇳", label: "Trung Quốc" },
];

interface AreaCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export default function AreaCodeSelect({
  value,
  onChange,
}: AreaCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-32 h-[46px] border rounded-lg bg-white flex items-center justify-between px-3 cursor-pointer transition-colors select-none
        ${
          isOpen
            ? "border-blue-600 ring-1 ring-blue-600"
            : "border-gray-300 hover:border-blue-400"
        }
      `}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {selectedCountry.code}
        </span>
      </div>

      <ChevronDown
        size={16}
        className={`text-gray-500 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />

      {/* Dropdown List with CSS Grid Animation */}
      <div
        className={`absolute top-[115%] left-0 w-[240px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 grid transition-[grid-template-rows,opacity] duration-300 ease-out
          ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 pointer-events-none border-0 shadow-none"
          }
        `}
      >
        <div className="overflow-hidden min-h-0">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            {COUNTRY_CODES.map((item) => {
              const isSelected = item.code === value;
              return (
                <div
                  key={item.code}
                  className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50 last:border-0
                    ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(item.code);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.flag}</span>
                    <div className="flex flex-col">
                      <span className="leading-none mb-1">{item.label}</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {item.code}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckIcon fontSize="small" className="text-blue-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
