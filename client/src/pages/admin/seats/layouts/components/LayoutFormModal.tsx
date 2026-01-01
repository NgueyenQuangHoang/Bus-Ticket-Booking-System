import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { BusLayout } from '../../../../../types/seat';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (layoutData: Partial<BusLayout>) => void;
  templates: BusLayout[];
}

export default function LayoutFormModal({ open, onClose, onSubmit, templates = [] }: Props) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | number>('');
  const [formData, setFormData] = useState<Partial<BusLayout>>({
    layout_name: '',
    total_rows: 0,
    total_columns: 0,
    floor_count: 1
  });



  const handleTemplateChange = (templateId: string | number) => {
    setSelectedTemplateId(templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        // Auto-fill name from template
        layout_name: template.layout_name,
        total_rows: template.total_rows,
        total_columns: template.total_columns,
        floor_count: template.floor_count
      }));
    } else {
      // If for some reason template is not found (or cleared if we allowed clear)
      // Since we don't allow "custom" anymore, we might want to reset or do nothing
    }
  };

  const handleSubmit = () => {
    if (!selectedTemplateId) {
      alert('Vui lòng chọn sơ đồ mẫu');
      return;
    }
    if (!formData.layout_name) {
      // Should normally be set by template, but just in case
      alert('Vui lòng chọn sơ đồ mẫu');
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({ layout_name: '', total_rows: 0, total_columns: 0, floor_count: 1 });
    setSelectedTemplateId('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-lg font-bold">
        <i className="fa-solid fa-plus mr-2 text-blue-500"></i>
        Chọn mẫu sơ đồ ghế
      </DialogTitle>
      <DialogContent>
        <div className="space-y-6 py-4">
          <FormControl fullWidth>
            <InputLabel>Chọn sơ đồ mẫu</InputLabel>
            <Select
              value={selectedTemplateId}
              label="Chọn sơ đồ mẫu"
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              {templates.length === 0 && <MenuItem disabled value="">Chưa có mẫu nào</MenuItem>}
              {templates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.layout_name} ({t.total_rows}x{t.total_columns}, {t.floor_count} tầng)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Name input removed as per request to use template name directly */}
          <div className="bg-gray-50 px-3 py-2 border rounded text-sm text-gray-500">
             Tên sơ đồ: <span className="font-semibold text-gray-800">{formData.layout_name || "(Chọn mẫu để xem tên)"}</span>
          </div>

          {/* Information Display instead of inputs */}
          {selectedTemplateId && (
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Số hàng</span>
                <span className="font-semibold text-lg">{formData.total_rows}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Số cột</span>
                <span className="font-semibold text-lg">{formData.total_columns}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-500 uppercase">Số tầng</span>
                <span className="font-semibold text-lg">{formData.floor_count}</span>
              </div>
            </div>
          )}

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
          Chọn sơ đồ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
