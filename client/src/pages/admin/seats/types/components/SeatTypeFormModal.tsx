import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tooltip, IconButton } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import type { SeatType } from '../../../../../types/seat';

interface Props {
  initialData?: SeatType;
  onSubmit: (data: Partial<SeatType>) => void;
  isEdit?: boolean;
}

export default function SeatTypeFormModal({ initialData, onSubmit, isEdit = false }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SeatType>>({
    type_name: '',
    description: '',
    price_multiplier: 1,
    color: '#000000'
  });

  const handleOpen = () => {
    if (isEdit && initialData) {
        setFormData(initialData);
    } else {
        setFormData({
            type_name: '',
            description: '',
            price_multiplier: 1,
            color: '#000000'
        });
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setOpen(false);
    if (!isEdit) {
        setFormData({
            type_name: '',
            description: '',
            price_multiplier: 1,
            color: '#000000'
        });
    }
  };

  return (
    <>
      {isEdit ? (
        <Tooltip title="Chỉnh sửa">
            <IconButton 
                size="small" 
                color="warning" 
                onClick={handleOpen}
                className='border border-yellow-300 hover:bg-yellow-50'
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
      ) : (
        <Button 
            variant="contained" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
            className='bg-blue-600'
        >
            Thêm loại ghế
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Chỉnh sửa loại ghế' : 'Thêm loại ghế mới'}</DialogTitle>
        <DialogContent className='space-y-8 py-6'>
            <TextField
                label="Tên loại ghế"
                fullWidth
                variant="outlined"
                value={formData.type_name}
                onChange={(e) => setFormData({...formData, type_name: e.target.value})}
                className='!mb-2'
            />
            <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className='!mb-2'
            />
             <div className='grid grid-cols-2 gap-6'>
                <TextField
                    label="Hệ số giá (VD: 1.5)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    inputProps={{ step: 0.1, min: 1 }}
                    value={formData.price_multiplier}
                    onChange={(e) => setFormData({...formData, price_multiplier: parseFloat(e.target.value)})}
                />
                <TextField
                    label="Màu sắc"
                    type="color"
                    fullWidth
                    variant="outlined"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
             </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)} color="inherit">Hủy</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}