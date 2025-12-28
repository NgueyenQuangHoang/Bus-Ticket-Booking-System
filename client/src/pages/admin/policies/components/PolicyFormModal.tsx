import { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';
import type { Policy } from './PolicyTable';
import CustomSelect from './CustomSelect';

interface PolicyHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: Omit<Policy, 'id'> | Policy) => void;
  policy?: Policy | null;
}

const ROUTE_OPTIONS = [
  { value: "Bến xe Miền Đông → Bến xe Mỹ Đình", label: "Bến xe Miền Đông → Bến xe Mỹ Đình" },
  { value: "Bến xe Miền Đông → Bến xe Giáp Bát", label: "Bến xe Miền Đông → Bến xe Giáp Bát" },
  { value: "Bến xe Miền Tây → Bến xe Mỹ Đình", label: "Bến xe Miền Tây → Bến xe Mỹ Đình" },
  { value: "Hồ Chí Minh → Đà Lạt", label: "Hồ Chí Minh → Đà Lạt" },
  { value: "Đà Lạt → Hồ Chí Minh", label: "Đà Lạt → Hồ Chí Minh" },
];

export default function PolicyFormModal({ isOpen, onClose, onSave, policy }: PolicyHeaderModalProps) {
  const [formData, setFormData] = useState({
    route_name: '',
    time_limit: '',
    refund_percent: '',
  });
  const [errors, setErrors] = useState<{ route_name?: string; time_limit?: string; refund_percent?: string }>({});

  useEffect(() => {
    if (policy) {
      setFormData({
        route_name: policy.route_name,
        time_limit: policy.time_limit.toString(),
        refund_percent: policy.refund_percent.toString(),
      });
    } else {
      setFormData({
        route_name: '',
        time_limit: '',
        refund_percent: '',
      });
    }
    setErrors({});
  }, [policy, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.route_name) {
      newErrors.route_name = 'Vui lòng chọn tuyến xe';
    }
    
    if (!formData.time_limit) {
      newErrors.time_limit = 'Vui lòng nhập thời hạn';
    } else if (Number(formData.time_limit) < 0) {
        newErrors.time_limit = 'Thời hạn không được âm';
    }

    if (!formData.refund_percent) {
      newErrors.refund_percent = 'Vui lòng nhập tỷ lệ hoàn tiền';
    } else if (Number(formData.refund_percent) < 0 || Number(formData.refund_percent) > 100) {
        newErrors.refund_percent = 'Tỷ lệ phải từ 0 - 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
          ...(policy && { id: policy.id }),
          route_name: formData.route_name,
          time_limit: Number(formData.time_limit),
          refund_percent: Number(formData.refund_percent),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {policy ? 'Chỉnh sửa chính sách' : 'Thêm chính sách mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <CustomSelect
                label="Tuyến xe"
                options={ROUTE_OPTIONS}
                value={formData.route_name}
                onChange={(val) => setFormData({ ...formData, route_name: val })}
                placeholder="Chọn tuyến xe áp dụng"
            />
            {errors.route_name && <p className="text-red-500 text-xs mt-1">{errors.route_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Thời hạn (Phút)</label>
            <input
              type="number"
              value={formData.time_limit}
              onChange={(e) => setFormData({ ...formData, time_limit: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Nhập số phút (VD: 1440)"
            />
             <p className="text-xs text-slate-500 mt-1">Khoảng thời gian tối thiểu trước khi khởi hành để được hoàn tiền.</p>
            {errors.time_limit && <p className="text-red-500 text-xs mt-1">{errors.time_limit}</p>}
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Tỷ lệ hoàn tiền (%)</label>
             <div className="relative">
                <input
                    type="number"
                    value={formData.refund_percent}
                    onChange={(e) => setFormData({ ...formData, refund_percent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Nhập tỷ lệ %"
                    min="0"
                    max="100"
                />
             </div>
             {errors.refund_percent && <p className="text-red-500 text-xs mt-1">{errors.refund_percent}</p>}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-200 cursor-pointer"
            >
              {policy ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
