import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import SeatToolbar from './components/SeatToolbar';
import SeatFloorSwitch from './components/SeatFloorSwitch';
import SeatGrid from './components/SeatGrid';
import SeatLegend from './components/SeatLegend';
import LayoutFormModal from './components/LayoutFormModal';
import type { BusLayout, SeatPosition, SeatType } from '../../../../types/seat';
import type { Bus } from '../../../../types/bus';
import seatService from '../../../../services/admin/seatService';
import busService from '../../../../services/admin/busService';

export default function SeatLayoutPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<number | string>('');
  
  const [layout, setLayout] = useState<BusLayout | null>(null);
  const [positions, setPositions] = useState<SeatPosition[]>([]);
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    busService.getAllBuses().then(setBuses);
    seatService.getAllSeatTypes().then(setSeatTypes);
  }, []);

  const handleBusChange = async (busId: string) => {
    setSelectedBusId(busId);
    if (!busId) {
      setLayout(null);
      setPositions([]);
      return;
    }

    // Fetch fresh bus data from API to get latest layout_id
    const bus = await busService.getBusById(busId);
    if (!bus || !bus.layout_id) {
      setLayout(null);
      setPositions([]);
      return;
    }

    const details = await seatService.getLayoutDetails(bus.layout_id);
    if (details) {
      setLayout(details.layout);
      setPositions(details.positions);
    }
  };

  const handleSave = async () => {
    if (!layout || !layout.id) return;
    
    const success = await seatService.updateLayoutPositions(layout.id, positions);
    if (success) {
      alert('Đã lưu sơ đồ ghế thành công!');
    } else {
      alert('Có lỗi khi lưu sơ đồ. Vui lòng thử lại.');
    }
  };

  const handleReset = () => {
    if (selectedBusId) handleBusChange(String(selectedBusId));
  };

  const handleCreateLayout = async (layoutData: Partial<BusLayout>) => {
    if (!selectedBusId) {
      alert('Vui lòng chọn xe trước khi tạo sơ đồ.');
      return;
    }

    const createdLayout = await seatService.createLayout(layoutData, []);
    if (createdLayout && createdLayout.id) {
      await busService.updateBusLayout(selectedBusId, createdLayout.id);
      
      setLayout(createdLayout);
      setPositions([]);
      setIsModalOpen(false);

      const updatedBuses = await busService.getAllBuses();
      setBuses(updatedBuses);

      alert(`Đã tạo sơ đồ "${layoutData.layout_name}" thành công!`);
    } else {
      alert('Có lỗi khi tạo sơ đồ. Vui lòng thử lại.');
    }
  };

  return (
    <>
      <div className='space-y-5 py-5'>
        {/* Header */}
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Sơ đồ bố trí ghế</h1>
          <p className='text-gray-500'>Cấu hình ghế cho từng xe</p>
        </div>

        {/* Toolbar */}
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 flex-wrap'>
          <SeatToolbar
            buses={buses}
            selectedBusId={selectedBusId}
            onBusChange={handleBusChange}
            onCreateLayout={() => setIsModalOpen(true)}
          />

          <div className='flex items-center gap-2'>
            <SeatFloorSwitch
              activeFloor={activeFloor}
              floorCount={layout?.floor_count || 1}
              onFloorChange={setActiveFloor}
            />
            <Button 
              variant="contained" 
              color="inherit" 
              className='bg-gray-200 text-gray-700 normal-case'
              startIcon={<i className="fa-solid fa-pen"></i>}
            >
              Chế độ xem
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          {/* Left: Preview */}
          <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex items-center justify-center p-8'>
            {selectedBusId && layout ? (
              <div className='border-4 border-gray-200 rounded-[2rem] p-8 pb-12 relative max-w-md w-full bg-gray-50 min-h-[500px]'>
                {/* Front of bus visual */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gray-200 rounded-b-3xl opacity-50"></div>

                {/* Floor Label Badge */}
                <div className='absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100 flex items-center gap-2'>
                  <i className="fa-solid fa-layer-group"></i>
                  Tầng {activeFloor}
                </div>
                
                <div className="mt-6">
                  <SeatGrid 
                    rows={layout.total_rows}
                    cols={layout.total_columns}
                    positions={positions}
                    setPositions={setPositions}
                    activeFloor={activeFloor}
                  />
                </div>

                {/* Driver decoration */}
                {activeFloor === 1 && (
                  <div className='mt-8 pt-6 border-t border-dashed border-gray-300 flex flex-col items-center gap-2'>
                    <div className='w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center text-gray-300'>
                      <i className="fa-solid fa-dharmachakra text-xl"></i>
                    </div>
                    <span className='text-xs text-gray-400 font-medium uppercase tracking-wider'>Khoang lái</span>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-gray-400 text-center'>
                <i className="fa-solid fa-bus text-4xl mb-2"></i>
                <p>Vui lòng chọn xe để xem sơ đồ</p>
              </div>
            )}
          </div>

          {/* Right: Legend & Actions */}
          <div className='space-y-4'>
            <SeatLegend seatTypes={seatTypes} />
            
            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3'>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSave}
                className='bg-blue-600'
                startIcon={<i className="fa-solid fa-floppy-disk"></i>}
              >
                Lưu sơ đồ
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                fullWidth 
                onClick={handleReset}
                className='border-gray-300 text-gray-600'
              >
                Hủy thay đổi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Layout Modal */}
      <LayoutFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLayout}
      />
    </>
  );
}
