import { useState, useRef, useEffect } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  label?: string;
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
};

export default function CustomSelect({ label, options, value, onChange, placeholder = "Chọn giá trị" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-3 py-2 text-left 
          border border-slate-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 outline-none 
          transition-all 
          flex items-center justify-between 
          bg-white cursor-pointer
        "
        title={selectedOption?.label} // Show full text on hover
      >
        <span className={`truncate mr-2 ${selectedOption ? "text-slate-900" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <KeyboardArrowDown
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-dropdown-expand max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full px-4 py-2 text-left text-sm
                hover:bg-blue-50 hover:text-blue-600 transition-colors
                truncate
                ${value === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"}
              `}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              title={option.label}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
