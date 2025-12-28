import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { BusLayout } from '../../../../../types/seat';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (layoutData: Partial<BusLayout>) => void;
}

export default function LayoutFormModal({ open, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<BusLayout>>({
    layout_name: '',
    total_rows: 6,
    total_columns: 4,
    floor_count: 1
  });

  const handleChange = (field: keyof BusLayout, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.layout_name) {
      alert('Vui lòng nhập tên sơ đồ');
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({ layout_name: '', total_rows: 6, total_columns: 4, floor_count: 1 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-lg font-bold">
        <i className="fa-solid fa-plus mr-2 text-blue-500"></i>
        Tạo sơ đồ ghế mới
      </DialogTitle>
      <DialogContent>
        <div className="space-y-8 py-4">
          <TextField className='!mb-5 !-mt-1'
            label="Tên sơ đồ"
            placeholder="VD: Xe 45 chỗ ngồi"
            fullWidth
            value={formData.layout_name}
            onChange={(e) => handleChange('layout_name', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-6">
            <TextField
              label="Số hàng"
              type="number"
              inputProps={{ min: 1, max: 20 }}
              value={formData.total_rows}
              onChange={(e) => handleChange('total_rows', parseInt(e.target.value) || 1)}
            />
            <TextField
              label="Số cột"
              type="number"
              inputProps={{ min: 1, max: 6 }}
              value={formData.total_columns}
              onChange={(e) => handleChange('total_columns', parseInt(e.target.value) || 1)}
            />
          </div>

          <FormControl fullWidth className='!mb-5 !-mt-1'>
            <InputLabel>Số tầng</InputLabel>
            <Select
              value={formData.floor_count}
              label="Số tầng"
              onChange={(e) => handleChange('floor_count', e.target.value as number)}
            >
              <MenuItem value={1}>1 tầng</MenuItem>
              <MenuItem value={2}>2 tầng</MenuItem>
            </Select>
          </FormControl>

          {/* Preview hint */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
            <i className="fa-solid fa-info-circle mr-2"></i>
            Sơ đồ sẽ có <strong>{formData.total_rows} hàng</strong> x <strong>{formData.total_columns} cột</strong> = <strong>{(formData.total_rows || 0) * (formData.total_columns || 0)} vị trí</strong> mỗi tầng.
          </div>
        </div>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          <i className="fa-solid fa-check mr-2"></i>
          Tạo sơ đồ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
