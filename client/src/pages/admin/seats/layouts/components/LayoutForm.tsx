import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import type { BusLayout } from '../../../../../types/seat';

interface Props {
  formData: Partial<BusLayout>;
  setFormData: (data: Partial<BusLayout>) => void;
  onSave: () => void;
  isValid: boolean;
}

export default function LayoutForm({ formData, setFormData, onSave, isValid }: Props) {
  const handleChange = (field: keyof BusLayout, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Paper className='p-4 space-y-4 shadow-sm border border-gray-100 h-fit'>
      <h2 className='text-lg font-semibold text-gray-700'>Thông tin mẫu</h2>
      
      <TextField
        label="Tên sơ đồ"
        fullWidth
        size="small"
        value={formData.layout_name || ''}
        onChange={(e) => handleChange('layout_name', e.target.value)}
      />

      <div className='grid grid-cols-2 gap-3'>
        <TextField
            label="Số hàng"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 20 }}
            value={formData.total_rows || ''}
            onChange={(e) => handleChange('total_rows', parseInt(e.target.value))}
        />
        <TextField
            label="Số cột"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 10 }}
            value={formData.total_columns || ''}
            onChange={(e) => handleChange('total_columns', parseInt(e.target.value))}
        />
      </div>

      <FormControl fullWidth size="small">
        <InputLabel>Số tầng</InputLabel>
        <Select
            value={formData.floor_count || 1}
            label="Số tầng"
            onChange={(e) => handleChange('floor_count', e.target.value)}
        >
            <MenuItem value={1}>1 Tầng</MenuItem>
            <MenuItem value={2}>2 Tầng</MenuItem>
        </Select>
      </FormControl>

      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={onSave}
        disabled={!isValid}
        className='mt-4'
      >
        Lưu mẫu ghế
      </Button>
      
      <div className='text-xs text-gray-500 mt-2'>
        * Điều chỉnh số hàng/cột sẽ đặt lại lưới ghế bên phải.
      </div>
    </Paper>
  );
}
