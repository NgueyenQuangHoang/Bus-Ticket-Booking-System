import { Search } from "@mui/icons-material";

interface UserFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function UserSearch({
  searchTerm,
  onSearchChange,
}: UserFilterProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          sx={{ fontSize: 20 }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}
