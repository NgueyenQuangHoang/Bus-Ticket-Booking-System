/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import type { Role } from '../../../../../types';
import { v4 as uuidv4 } from 'uuid'

interface PropType {
    isOpen: boolean
    onToggle: () => void
    onSubmit: (role: Role) => void
    role : Role | undefined 
}

export default function PermissionFormModal({ isOpen, onToggle, onSubmit, role }: PropType) {

    const [errors, setErrors] = useState<string>();
    const [formData, setFormData] = useState<Role>(() => {
        return role ? role :{id: uuidv4(), role_name: ''}
    })
    useEffect(() => {
        setErrors('')
        if(role){
            setFormData(role)
        }else{
            setFormData({ id: uuidv4(), role_name: '' })
        }
    }, [isOpen, role])


    if (!isOpen) {
        return <></>
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-in">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                    </h2>
                    <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <Close />
                    </button>
                </div>

                <form className="p-6 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (formData.role_name) {
                            setErrors('Không được để dữ liệu trống')
                            onSubmit(formData)
                            onToggle()
                        }
                        console.log(formData);
                        
                    }}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tên quyền</label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                            placeholder="Nhập tên quyền (VD: ADMIN)..."
                            value={formData.role_name}
                            onChange={(e) => setFormData(prev => {return {...prev, role_name: e.target.value}})}
                        />
                        {errors && (
                            <p className="mt-1 text-sm text-red-500">{errors}</p>
                        )}
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                        <textarea
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all resize-none h-24 ${errors.description
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                                }`}

                            placeholder="Nhập mô tả quyền hạn..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                    </div> */}

                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
                            onClick={onToggle}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 cursor-pointer"
                        >
                            Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
