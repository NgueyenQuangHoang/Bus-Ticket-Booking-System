import { Delete, Edit } from '@mui/icons-material';
import type { Permission } from '../UserPermissionsPage';

interface PermissionTableProps {
  permissions: Permission[];
  onDelete: (id: number) => void;
  onEdit: (permission: Permission) => void;
}

export default function PermissionTable({ permissions, onDelete, onEdit }: PermissionTableProps) {
  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-200'>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Tên quyền</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Mô tả</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {permissions.map((p) => (
                <tr key={p.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-600 font-medium'>#{p.id}</td>
                  <td className='px-6 py-4 text-sm font-medium text-slate-900'>{p.name}</td>
                  <td className='px-6 py-4 text-sm text-slate-500 max-w-xs truncate'>{p.description}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                        <button 
                            onClick={() => onEdit(p)}
                            className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer'
                            title="Sửa"
                        >
                            <Edit sx={{ fontSize: 18 }} />
                        </button>
                        <button 
                            onClick={() => onDelete(p.id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
                            title="Xóa"
                        >
                            <Delete sx={{ fontSize: 18 }} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
            <span className='text-sm text-slate-500'>Tổng: <span className='font-medium'>{permissions.length}</span></span>
        </div>
      </div>
  );
}
