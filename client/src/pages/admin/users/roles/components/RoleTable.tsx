import { Delete, Edit } from '@mui/icons-material';
import type { UserRole } from '../RolesPage';

interface RoleTableProps {
  roles: UserRole[];
  onDelete: (id: number) => void;
  onEdit: (role: UserRole) => void;
}

export default function RoleTable({ roles, onDelete, onEdit }: RoleTableProps) {
    const getRoleColor = (role: string) => {
      switch (role) {
          case 'ADMIN': return 'bg-blue-100 text-blue-800';
          case 'BUS_COMPANY': return 'bg-purple-100 text-purple-800';
          default: return 'bg-slate-100 text-slate-800';
      }
    };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-200'>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID User</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Người dùng</th>
                <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Quyền</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200'>
              {roles.map((role) => (
                <tr key={role.id} className='hover:bg-slate-50 transition-colors'>
                  <td className='px-6 py-4 text-sm text-slate-600 font-medium'>#{role.id}</td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-slate-900'>{role.userName}</div>
                  </td>
                  <td className='px-6 py-4 text-center'>
                     <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                      ${getRoleColor(role.role)}
                    `}>
                      {role.role}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                        <button 
                            onClick={() => onEdit(role)}
                            className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer'
                            title="Sửa"
                        >
                            <Edit sx={{ fontSize: 18 }} />
                        </button>
                        <button 
                            onClick={() => onDelete(role.id)}
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
            <span className='text-sm text-slate-500'>Tổng: <span className='font-medium'>{roles.length}</span></span>
        </div>
      </div>
  );
}
