import { Download } from "@mui/icons-material";

type Props = {
  totalCount: number;
  onExportClick?: () => void;
};

export default function TicketHeader({ totalCount, onExportClick }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý vé</h1>
        <p className="text-slate-500 text-sm mt-1">{totalCount} vé</p>
      </div>

      <button 
        onClick={onExportClick}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all shadow-sm font-medium text-sm"
      >
        <Download sx={{ fontSize: 20 }} />
        <span>Xuất báo cáo</span>
      </button>
    </div>
  );
}
