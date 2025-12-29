import { Add } from '@mui/icons-material';

interface PolicyHeaderProps {
  count: number;
  onAdd: () => void;
}

export default function PolicyHeader({ count, onAdd }: PolicyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Chính sách hủy vé</h1>
        <p className="text-sm text-slate-500 mt-1">Cấu hình chính sách hoàn tiền</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Tổng:</span>
          <span className="text-sm font-bold text-slate-800">{count}</span>
        </div>
        
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-sm hover:shadow-blue-200 hover:cursor-pointer"
        >
          <Add sx={{ fontSize: 20 }} />
          <span>Thêm chính sách</span>
        </button>
      </div>
    </div>
  );
}
