import { useState } from 'react';
import { Close } from '@mui/icons-material';
import type { Permission } from '../UserPermissionsPage';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permission: Omit<Permission, 'id'> | Permission) => void;
  permission?: Permission | null;
}



interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permission: Omit<Permission, 'id'> | Permission) => void;
  permission?: Permission | null;
}

export default function PermissionFormModal({ isOpen, onClose, onSave, permission }: PermissionModalProps) {
  const [formData, setFormData] = useState(() => {
    if (permission) {
      return {
        name: permission.name,
        description: permission.description,
      };
    }
    return {
      name: '',
      description: '',
    };
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên quyền không được để trống';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
          ...(permission && { id: permission.id }),
          ...formData
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {permission ? 'Cập nhật quyền' : 'Thêm quyền mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <Close />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên quyền</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.name 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.name}
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Nhập tên quyền (VD: ADMIN)..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all resize-none h-24 ${
                errors.description
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.description}
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Nhập mô tả quyền hạn..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 cursor-pointer"
            >
              {permission ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
