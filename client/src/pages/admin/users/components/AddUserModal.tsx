import { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { validateUserForm, type UserFormData } from './validation';
import type { User } from '../UsersPage';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Partial<User>) => void;
  user?: User | null; // If provided, we are in Edit mode
}

export default function AddUserModal({ isOpen, onClose, onAdd, user }: AddUserModalProps) {
  const [formData, setFormData] = useState<UserFormData & { status: string }>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  useEffect(() => {
    if (user) {
        setFormData({
            fullName: user.first_name + ' ' + user.last_name, 
            email: user.email,
            phone: user.phone || '',
            password: '', 
            status: user.status || 'ACTIVE'
        });
    } else {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            status: 'ACTIVE'
        });
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    // If editing, password is optional
    const dataToValidate = { ...formData };
    if (user && !dataToValidate.password) {
        delete dataToValidate.password;
    }

    const { isValid, errors: validationErrors } = validateUserForm(dataToValidate);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Split fullName to first/last
    const names = formData.fullName.trim().split(' ');
    const lastName = names.length > 1 ? names.pop() || '' : '';
    const firstName = names.join(' ');

    const finalData: Partial<User> = {
        id: user ? user.id : undefined, // Keep ID if editing
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
    };

    if (formData.password) {
        finalData.password = formData.password;
    } else if (user) {
        finalData.password = user.password;
    }

    onAdd(finalData);
    onClose();
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
      setFormData((prev: UserFormData & { status: string }) => ({ ...prev, [field]: value }));
      if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
              {user ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors hover:cursor-pointer">
            <Close />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.fullName 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              placeholder="Nhập họ tên..."
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.email 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="example@email.com"
            />
             {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.phone 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="0901234567"
            />
             {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu {user && <span className="text-slate-400 font-normal">(Để trống nếu không đổi)</span>}
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.password 
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder="********"
            />
             {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors hover:cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 hover:cursor-pointer"
            >
              {user ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
