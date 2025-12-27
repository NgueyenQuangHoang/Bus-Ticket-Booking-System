import { Search } from "@mui/icons-material";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TicketSearch({ value, onChange }: Props) {
  return (
    <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm'>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
  );
}
