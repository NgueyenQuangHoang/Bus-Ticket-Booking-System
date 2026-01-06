import { Close } from '@mui/icons-material';
import type { User } from '../../../../types';
import { useState, useEffect } from 'react';
import { busCompanyService } from '../../../../services/busCompanyService';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  roleName?: string;
}

export default function ViewUserModal({ isOpen, onClose, user, roleName }: ViewUserModalProps) {
  const [busCompanyName, setBusCompanyName] = useState<string>('');

  useEffect(() => {
    const fetchBusCompany = async () => {
      if (user?.bus_company_id) {
        try {
          const company = await busCompanyService.getBusCompanyById(user.bus_company_id);
          if (company) setBusCompanyName(company.company_name);
        } catch (error) {
          console.error("Failed to fetch bus company", error);
        }
      } else {
        setBusCompanyName('');
      }
    };
    fetchBusCompany();
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết người dùng</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
            <Close />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">User ID</label>
              <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Họ</label>
              <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.first_name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Tên</label>
              <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.last_name}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
            <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Số điện thoại</label>
            <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.phone}</div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Mật khẩu</label>
            <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{user.password}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Vai trò</label>
              <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                {roleName || 'N/A'}
              </div>
            </div>
            {busCompanyName && (
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Nhà xe</label>
                <div className="text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  {busCompanyName}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Trạng thái</label>
            <div className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {user.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Ngày tạo</label>
              <div className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                {new Date(user?.created_at ? user?.created_at : "").toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Ngày cập nhật</label>
              <div className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                {new Date(user.updated_at ? user.updated_at : '').toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors hover:cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
