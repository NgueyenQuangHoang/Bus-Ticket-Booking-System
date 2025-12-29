import { Edit, Delete, ChevronLeft, ChevronRight } from '@mui/icons-material';

export interface Policy {
  id: number;
  route_name: string;
  time_limit: number; // minutes
  refund_percent: number; // percentage (0-100)
}

interface PolicyTableProps {
  policies: Policy[];
  onEdit: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export default function PolicyTable({ 
  policies, 
  onEdit, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalItems
}: PolicyTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-true">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tuyến</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Thời hạn (Phút)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Hoàn tiền (%)</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">
                  #{policy.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {policy.route_name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 font-mono">
                  {policy.time_limit}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                  {policy.refund_percent}%
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(policy)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit sx={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => onDelete(policy)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
                      title="Xóa"
                    >
                      <Delete sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Chưa có chính sách nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination Footer */}
       <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
            <span className='text-sm text-slate-500'>
                Hiển thị <span className='font-medium'>{policies.length}</span> / <span className='font-medium'>{totalItems}</span> chính sách
            </span>
            
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer'
                >
                    <ChevronLeft sx={{ fontSize: 20 }} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer
                            ${currentPage === page 
                                ? 'bg-blue-600 text-white' 
                                : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer'
                >
                    <ChevronRight sx={{ fontSize: 20 }} />
                </button>
            </div>
        </div>
    </div>
  );
}
