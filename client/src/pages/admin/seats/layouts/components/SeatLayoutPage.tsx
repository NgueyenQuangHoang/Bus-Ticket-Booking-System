import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import SeatToolbar from './SeatToolbar';
import SeatGrid from './SeatGrid';
import SeatLegend from './SeatLegend';
import type { BusLayout, SeatPosition, SeatType } from '../../../../../types/seat';
import seatService from '../../../../../services/admin/seatService';
import { getStoredBusCompanyId, getStoredRole } from '../../../../../utils/authStorage';

export default function SeatLayoutPage() {
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [templates, setTemplates] = useState<BusLayout[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<number | string>('');

  const [layout, setLayout] = useState<BusLayout | null>(null);
  const [positions, setPositions] = useState<SeatPosition[]>([]);

  useEffect(() => {
    seatService.getAllSeatTypes().then(setSeatTypes);
    seatService.getAllTemplates().then((data) => {
      const filtered = !isBusCompany || !busCompanyId
        ? (data || [])
        : (data || []).filter((t) => {
            const ownerId = t.bus_company_id ?? (t as any).company_id;
            return !ownerId || String(ownerId) === String(busCompanyId);
          });
      setTemplates(filtered);
    });
  }, [isBusCompany, busCompanyId]);

  const handleLayoutChange = async (layoutId: string) => {
    setSelectedLayoutId(layoutId);
    if (!layoutId) {
      setLayout(null);
      setPositions([]);
      return;
    }
    const details = await seatService.getLayoutDetails(layoutId);
    if (details) {
      setLayout(details.layout);
      setPositions(details.positions);
    }
  };

  const handleSave = async () => {
    if (!layout?.id) return;

    const success = await seatService.updateLayoutPositions(layout.id, positions);
    if (success) {
      // BUS_COMPANY claiming a global template — assign their company
      if (isBusCompany && busCompanyId && !layout.bus_company_id && !(layout as any).company_id) {
        const updated: any = await seatService.updateTemplate(layout.id, {
          ...layout,
          bus_company_id: busCompanyId,
        });
        const updatedLayout = updated?.data ?? updated;
        if (updatedLayout) setLayout(updatedLayout);
      }
      alert('Đã lưu sơ đồ ghế thành công!');
    } else {
      alert('Có lỗi khi lưu sơ đồ. Vui lòng thử lại.');
    }
  };

  const handleReset = () => {
    if (selectedLayoutId) handleLayoutChange(String(selectedLayoutId));
  };

  return (
    <>
      <div className='space-y-5 py-5'>
        {/* Header */}
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Sơ đồ bố trí ghế</h1>
          <p className='text-gray-500'>Cấu hình vị trí ghế cho từng mẫu sơ đồ</p>
        </div>

        {/* Toolbar */}
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 flex-wrap'>
          <SeatToolbar
            templates={templates}
            selectedLayoutId={selectedLayoutId}
            onLayoutChange={handleLayoutChange}
          />
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-12 gap-8 items-start'>

          {/* LEFT: Legend & Actions */}
          <div className='col-span-12 lg:col-span-3 space-y-6'>
            <SeatLegend seatTypes={seatTypes} />

            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3'>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                className='bg-blue-600 shadow-none hover:shadow-md transition-shadow py-2.5 rounded-lg font-medium'
                startIcon={<i className="fa-solid fa-floppy-disk"></i>}
              >
                Lưu sơ đồ
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={handleReset}
                className='border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all py-2.5 rounded-lg'
              >
                Hủy thay đổi
              </Button>
            </div>
          </div>

          {/* RIGHT: Seat Grid */}
          <div className='col-span-12 lg:col-span-9 bg-white rounded-xl shadow-sm border border-gray-100 min-h-150 p-8'>
            {selectedLayoutId && layout ? (
              <div className='flex justify-center gap-12 flex-wrap'>
                {/* Floor 1 */}
                <div className='flex flex-col items-center gap-4'>
                  <h3 className="text-gray-500 font-medium text-lg">Tầng dưới</h3>
                  <div className='bg-gray-100 rounded-[3rem] p-6 pb-12 w-70 min-h-125 relative flex flex-col items-center'>
                    <SeatGrid
                      rows={layout.total_rows}
                      cols={layout.total_columns}
                      positions={positions}
                      setPositions={setPositions}
                      activeFloor={1}
                    />
                  </div>
                </div>

                {/* Floor 2 (if exists) */}
                {layout.floor_count === 2 && (
                  <div className='flex flex-col items-center gap-4'>
                    <h3 className="text-gray-500 font-medium text-lg">Tầng trên</h3>
                    <div className='bg-gray-100 rounded-[3rem] p-6 pb-12 w-70 min-h-125 relative flex flex-col items-center pt-22'>
                      <SeatGrid
                        rows={layout.total_rows}
                        cols={layout.total_columns}
                        positions={positions}
                        setPositions={setPositions}
                        activeFloor={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='h-full flex flex-col items-center justify-center text-gray-400 min-h-100'>
                <i className="fa-solid fa-table-cells text-5xl mb-4 text-gray-200"></i>
                <p className="text-lg font-medium text-gray-400">Vui lòng chọn mẫu sơ đồ để xem sơ đồ ghế</p>
                <p className="text-sm text-gray-300 mt-1">Chọn mẫu từ thanh công cụ phía trên</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
