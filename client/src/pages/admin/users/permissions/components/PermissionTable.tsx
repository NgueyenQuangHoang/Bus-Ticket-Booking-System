import { Delete, Edit } from "lucide-react";
import type { Role } from "../../../../../types";

interface PropType {
    role: Role[]
    openModalEdit: () => void 
    setRole: (role: Role) => void
    onDelete: (role: Role) => void
}

export default function PermissionTable({ role, openModalEdit, setRole , onDelete}: PropType) {
    return (
        <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-slate-50 border-b border-slate-200'>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>ID</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider'>Tên quyền</th>
                            <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200'>
                        {
                            role.map((item, index) => (

                                <tr key={index} className='hover:bg-slate-50 transition-colors'>
                                    <td className='px-6 py-4 text-sm text-slate-600 font-medium'>{index + 1}</td>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900'>{item.role_name}</td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center justify-end gap-2'>
                                            <button
                                                onClick={() => {openModalEdit(); setRole(item);}}
                                                className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer'
                                                title="Sửa"
                                                
                                            >
                                                <Edit />
                                            </button>
                                            <button
                                                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
                                                title="Xóa"
                                                onClick={()=>{
                                                    onDelete(item)
                                                }}
                                            >
                                                <Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                        {/* {permissions.map((p) => (
              ))} */}
                    </tbody>
                </table>
            </div>

            <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
                {/* <span className='text-sm text-slate-500'>Tổng: <span className='font-medium'>{permissions.length}</span></span> */}
            </div>
        </div>
    );
}
