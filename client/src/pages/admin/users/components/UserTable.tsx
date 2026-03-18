import { Lock, LockOpen, Visibility, Edit, Delete } from '@mui/icons-material';
import UserStatusBadge from './UserStatusBadge';
import type { User } from '../../../../types';

interface UserTableProps {
  users: User[];
  onToggleStatus: (id: string, status: string) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onToggleStatus, onView, onEdit, onDelete }: UserTableProps) {
  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-slate-50 border-b border-slate-200'>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Họ tên</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Email</th>
              <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Điện thoại</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Trạng thái</th>
              <th className='px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider'>Vai Trò</th>
              <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200'>
            {users.map((user, index) => (
              <tr key={index} className='hover:bg-slate-50 transition-colors'>
                <td className='px-6 py-4 text-sm text-slate-600 font-medium font-mono'>#{index+1}</td>
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-slate-900'>{user.first_name} {user.last_name}</div>
                </td>
                <td className='px-6 py-4 text-sm text-slate-600'>{user.email}</td>
                <td className='px-6 py-4 text-sm text-slate-600'>{user.phone}</td>
                <td className='px-6 py-4 text-center'>
                  <UserStatusBadge status={user.status ? user.status : 'ACTIVE'} />
                </td>
                <td className='px-6 py-4 text-sm text-slate-600 text-center'>{user.role_names || ''}</td>
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-end gap-2'>
                      <button 
                          onClick={() => {
                            if (user.status === 'ACTIVE'){
                              onToggleStatus(user.id ? user.id : "", 'INACTIVE')
                            }else{
                              onToggleStatus(user.id ? user.id : "", 'ACTIVE')
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors hover:cursor-pointer ${
                              user.status === 'ACTIVE' 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                          title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                          {user.status === 'ACTIVE' ? <LockOpen sx={{ fontSize: 20 }} /> : <Lock sx={{ fontSize: 20 }} />}
                      </button>

                      <button 
                        onClick={() => onView(user)}
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:cursor-pointer'
                        title="Xem chi tiết"
                      >
                          <Visibility sx={{ fontSize: 20 }} />
                      </button>

                      <button 
                        onClick={() => onEdit(user)}
                        className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors hover:cursor-pointer'
                        title="Chỉnh sửa"
                      >
                          <Edit sx={{ fontSize: 20 }} />
                      </button>

                      <button 
                        onClick={() => onDelete(user)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer'
                        title="Xóa"
                      >
                          <Delete sx={{ fontSize: 20 }} />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Mock) */}
      <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
          <span className='text-sm text-slate-500'>Tổng: <span className='font-medium'>{users.length}</span></span>
      </div>
    </div>
  );
}
