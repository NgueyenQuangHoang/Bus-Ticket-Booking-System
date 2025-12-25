import { Menu } from '@mui/icons-material';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader = ({ onToggleSidebar }: AdminHeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer">
          <Menu sx={{ fontSize: 24 }} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-700">Admin User</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          A
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
