import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Close } from '@mui/icons-material';
import CustomSelect from './CustomSelect';
import type { PaymentProvider } from '../PaymentGatewaysPage';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<PaymentProvider, 'payment_provider_id'> | PaymentProvider) => void;
  payment?: PaymentProvider | null;
}

export default function PaymentGatewayFormModal({ isOpen, onClose, onSave, payment }: PaymentGatewayModalProps) {
  const [formData, setFormData] = useState({
    provider_name: '',
    provider_type: 'GATEWAY',
    api_endpoint: '',
    id: ''
  });
  
  const [errors, setErrors] = useState<{ provider_name?: string; api_endpoint?: string }>({});

  // Update form data when payment prop changes or modal opens
  useEffect(() => {
    if (payment) {
      setFormData({
        provider_name: payment.provider_name,
        provider_type: payment.provider_type,
        api_endpoint: payment.api_endpoint,
        id: payment.id
      });
    } else {
      setFormData({
        provider_name: '',
        provider_type: 'GATEWAY',
        api_endpoint: '',
        id: uuidv4()
      });
    }
    setErrors({});
  }, [payment, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { provider_name?: string; api_endpoint?: string } = {};
    
    if (!formData.provider_name.trim()) {
      newErrors.provider_name = 'Tên cổng không được để trống';
    }
    
    if (!formData.api_endpoint.trim()) {
      newErrors.api_endpoint = 'API Endpoint không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
          ...(payment && { payment_provider_id: payment.payment_provider_id }),
          ...formData
      } as any);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {payment ? 'Cập nhật cổng thanh toán' : 'Thêm cổng thanh toán'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <Close />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên cổng</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.provider_name 
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.provider_name}
              onChange={e => {
                setFormData({ ...formData, provider_name: e.target.value });
                if (errors.provider_name) setErrors({ ...errors, provider_name: undefined });
              }}
              placeholder="Nhập tên cổng (VD: VNPay)..."
            />
            {errors.provider_name && (
              <p className="mt-1 text-sm text-red-500">{errors.provider_name}</p>
            )}
          </div>

            <CustomSelect
                label="Loại"
                options={[
                  { label: "GATEWAY", value: "GATEWAY" },
                  { label: "WALLET", value: "WALLET" },
                  { label: "QR_CODE", value: "QR_CODE" },
                ]}
                value={formData.provider_type}
                onChange={(value) => setFormData({ ...formData, provider_type: value })}
                placeholder="Chọn loại cổng..."
            />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                errors.api_endpoint
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={formData.api_endpoint}
              onChange={e => {
                setFormData({ ...formData, api_endpoint: e.target.value });
                if (errors.api_endpoint) setErrors({ ...errors, api_endpoint: undefined });
              }}
              placeholder="https://api.example.com..."
            />
            {errors.api_endpoint && (
              <p className="mt-1 text-sm text-red-500">{errors.api_endpoint}</p>
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
              {payment ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
