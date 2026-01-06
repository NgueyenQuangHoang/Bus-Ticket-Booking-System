import { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { validateUserForm, type UserFormData } from './validation';
import type { User, BusCompany } from '../../../../types';
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from '../../../../hooks';
import { busCompanyService } from '../../../../services/busCompanyService';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, 'user_id' | 'status' | 'created_at' | 'updated_at'>, role: string) => void;
  Edit: (user: User, role: string) => void;
  user?: User | null;
  statusForm: 'edit' | 'add';
}

export default function AddUserModal({ isOpen, onClose, onAdd, user, statusForm, Edit}: AddUserModalProps) {
  const [formData, setFormData] = useState<UserFormData & { status: string }>({
    last_name: '',
    first_name: '',
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE',
    bus_company_id: ''
  });
  const {roles} = useAppSelector(state => state.user)
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [role_id, setRole] = useState<string>('1')
  const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);

  useEffect(() => {
    const fetchBusCompanies = async () => {
      try {
        const res = await busCompanyService.getAllBusCompanies();
        if (res) setBusCompanies(res);
      } catch (error) {
        console.error("Failed to fetch bus companies", error);
      }
    };
    fetchBusCompanies();
  }, []);
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        status: user.status || 'ACTIVE',
        bus_company_id: user.bus_company_id || ''
      });
      setRole((user as any).role_id || '1'); // Assuming we have role_id available or passed, if not default to '1'. Ideally we should get role from props or user object.
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        status: 'ACTIVE',
        bus_company_id: ''
      });
      setRole('2'); // Default to USER (ID: 2) when adding new
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    // Validate
    // If editing, password is optional
    const dataToValidate = { ...formData };
    // if (user && !dataToValidate.password) {
    //   delete dataToValidate.password;
    // }
    const { isValid, errors: validationErrors } = validateUserForm(dataToValidate, user?true:false);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (role_id === '3' && !formData.bus_company_id) {
        setErrors(prev => ({...prev, bus_company_id: "Vui lòng chọn nhà xe"}));
        return;
    }

    // Split fullName to first/last
    const lastName = formData.last_name
    const firstName = formData.first_name

    const finalData: Omit<User, 'user_id' | 'status' | 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      first_name: firstName,
      last_name: lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      bus_company_id: role_id === '3' ? formData.bus_company_id : undefined
    };

    if (user) {
      finalData.password = user.password;
    }

    if (statusForm == 'add') {
      onAdd(finalData, role_id);
    } else if (user) {
      const newUser: User = {
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || '',
        password: formData.password ? formData.password : user.password,
        bus_company_id: role_id === '3' ? formData.bus_company_id : undefined,
        updated_at: (new Date()).toString()
      }
      
      Edit(newUser, role_id)
    }
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
          <div className='flex justify-between gap-3'>
            <div className='w-full'>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nhập họ</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.first_name
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                value={formData.first_name}
                onChange={e => handleChange('first_name', e.target.value)}
                placeholder="EX: Nguyễn Văn..."
              />
              {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
            </div>
            <div className='w-full'>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nhập tên</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.last_name
                  ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                value={formData.last_name}
                onChange={e => handleChange('last_name', e.target.value)}
                placeholder="EX: ...A"
              />
              {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.email
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.phone
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.password
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder="********"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Chọn vai trò
            </label>
            <select name="role" id=""
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all 
                border-slate-300 focus:ring-blue-500 focus:border-blue-500

                }`}
              value={role_id}
              onChange={(e) => { setRole(e.target.value) }}>
                {roles.map(item => (
                  <option value={item.id}>{item.role_name}</option>
                ))}
            </select>
          </div>

          {/* Bus Company Selection - Show only if Role is BUS_COMPANY (ID: 3) */}
          {role_id === '3' && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Chọn nhà xe
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                  errors.bus_company_id
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                value={formData.bus_company_id}
                onChange={(e) => handleChange('bus_company_id', e.target.value)}
              >
                <option value="">-- Chọn nhà xe --</option>
                {busCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
               {errors.bus_company_id && <p className="mt-1 text-xs text-red-500">{errors.bus_company_id}</p>}
            </div>
          )}

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
