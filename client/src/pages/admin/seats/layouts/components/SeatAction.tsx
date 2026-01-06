import { useState } from 'react';
import { Popover, TextField, Checkbox, FormControlLabel, Button, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import type { SeatPosition, SeatType } from '../../../../../types/seat';

interface Props {
  anchorEl: HTMLElement | null;
  position: SeatPosition | null;
  seatTypes: SeatType[];
  onClose: () => void;
  onSave: (pos: SeatPosition) => void;
  onRemove: () => void;
}

export default function SeatAction({ anchorEl, position, seatTypes, onClose, onSave, onRemove }: Props) {
  const [formData, setFormData] = useState<SeatPosition | null>(position);

  // Sync formData when position changes
  if (position && formData?.position_id !== position.position_id) {
    setFormData(position);
  }

  const handleChange = <K extends keyof SeatPosition>(field: K, value: SeatPosition[K]) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <div className='p-4 w-72 space-y-4'>
        <h4 className='font-semibold text-sm mb-2 flex items-center gap-2'>
          <i className="fa-solid fa-gear text-gray-400"></i>
          Cấu hình vị trí
        </h4>
        
        <TextField 
          label="Tên ghế (VD: A1)" 
          size="small" 
          fullWidth 
          value={formData?.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Loại ghế</InputLabel>
          <Select
            value={formData?.seat_type_id || ''}
            label="Loại ghế"
            onChange={(e) => handleChange('seat_type_id', e.target.value)}
          >
            <MenuItem value="">Trống</MenuItem>
            {seatTypes.map(type => (
              <MenuItem key={type.id || type.seat_type_id} value={type.id || type.seat_type_id}>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full' style={{backgroundColor: type.color}}></div>
                  {type.type_name}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className='grid grid-cols-2 gap-2 text-xs'>
          <FormControlLabel 
            control={<Checkbox 
              size="small" 
              checked={formData?.is_driver_seat || false}
              onChange={(e) => handleChange('is_driver_seat', e.target.checked)}
            />} 
            label={<span className='text-xs'>Ghế tài xế</span>} 
          />
          <FormControlLabel 
            control={<Checkbox 
              size="small" 
              checked={formData?.is_door || false}
              onChange={(e) => handleChange('is_door', e.target.checked)}
            />} 
            label={<span className='text-xs'>Cửa xe</span>} 
          />
          <FormControlLabel 
            control={<Checkbox 
              size="small" 
              checked={formData?.is_stair || false}
              onChange={(e) => handleChange('is_stair', e.target.checked)}
            />} 
            label={<span className='text-xs'>Cầu thang</span>} 
          />
          <FormControlLabel 
            control={<Checkbox 
              size="small" 
              checked={formData?.is_aisle || false}
              onChange={(e) => handleChange('is_aisle', e.target.checked)}
            />} 
            label={<span className='text-xs'>Lối đi</span>} 
          />
        </div>
        
        <Divider />
        
        <div className='flex justify-between'>
          <Button size="small" color="error" onClick={onRemove}>
            <i className="fa-solid fa-trash mr-1"></i>
            Xóa
          </Button>
          <Button size="small" variant="contained" onClick={handleSave}>
            <i className="fa-solid fa-check mr-1"></i>
            Xác nhận
          </Button>
        </div>
      </div>
    </Popover>
  );
}