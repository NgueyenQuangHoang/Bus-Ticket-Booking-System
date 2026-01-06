import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import SeatToolbar from './SeatToolbar';

import SeatGrid from './SeatGrid';
import SeatLegend from './SeatLegend';
import LayoutFormModal from './LayoutFormModal';
import type { BusLayout, SeatPosition, SeatType } from '../../../../../types/seat';
import type { Bus } from '../../../../../types/bus';
import seatService from '../../../../../services/admin/seatService';
import busService from '../../../../../services/admin/busService';
import { getStoredBusCompanyId, getStoredRole } from '../../../../../utils/authStorage';

export default function SeatLayoutPage() {
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [templates, setTemplates] = useState<BusLayout[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<number | string>('');
  
  const [layout, setLayout] = useState<BusLayout | null>(null);
  const [positions, setPositions] = useState<SeatPosition[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    busService.getAllBuses().then((data) => {
      const scopedBuses = isBusCompany
        ? (busCompanyId
            ? (data || []).filter((bus) => {
                const companyId = bus.bus_company_id ?? bus.company_id;
                return companyId && String(companyId) === String(busCompanyId);
              })
            : [])
        : (data || []);
      setBuses(scopedBuses);
    });
    seatService.getAllSeatTypes().then(setSeatTypes);
    seatService.getAllTemplates().then((data) => {
      const filteredTemplates = !isBusCompany || !busCompanyId
        ? (data || [])
        : (data || []).filter((t) => {
            const ownerId = t.bus_company_id ?? t.company_id;
            return !ownerId || String(ownerId) === String(busCompanyId);
          });
      setTemplates(filteredTemplates);
    });
  }, [isBusCompany, busCompanyId]);

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
    if (isBusCompany && busCompanyId) {
      const companyId = bus.bus_company_id ?? bus.company_id;
      if (!companyId || String(companyId) !== String(busCompanyId)) {
        setLayout(null);
        setPositions([]);
        return;
      }
    }

    const details = await seatService.getLayoutDetails(bus.layout_id);
    if (!details) {
      return;
    }

    // Nếu xe đang gán layout template (is_template=true) thì clone ra layout riêng cho xe
    if (details.layout.is_template) {
      const template = details.layout;
      const templatePositions = details.positions || [];

      const clonePayload: Partial<BusLayout> = {
        layout_name: template.layout_name,
        total_rows: template.total_rows,
        total_columns: template.total_columns,
        floor_count: template.floor_count,
        bus_company_id: bus.bus_company_id ?? bus.company_id ?? busCompanyId,
        is_template: false,
      };

      // Sao chép vị trí nhưng bỏ id/layout_id để JSON-server tạo mới
      const clonedPositions: Partial<SeatPosition>[] = templatePositions.map((pos) => {
        const { id, position_id, layout_id, ...rest } = pos as any;
        return { ...rest };
      });

      const newLayout = await seatService.createLayout(clonePayload, clonedPositions);
      if (newLayout?.id) {
        await busService.updateBusLayout(busId, newLayout.id);
        const clonedDetails = await seatService.getLayoutDetails(newLayout.id);
        setLayout(clonedDetails?.layout ?? newLayout);
        setPositions(clonedDetails?.positions ?? []);
        return;
      }
    }

    setLayout(details.layout);
    setPositions(details.positions);
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

    // Reuse existing layout with same signature to avoid duplicate records
    const existingLayouts = await seatService.getAllLayouts();
    const scopedLayouts = isBusCompany && busCompanyId
      ? (existingLayouts || []).filter(l => String(l.bus_company_id ?? l.company_id) === String(busCompanyId))
      : (existingLayouts || []);
    const duplicate = scopedLayouts.find(l =>
      String(l.layout_name) === String(layoutData.layout_name) &&
      Number(l.total_rows) === Number(layoutData.total_rows) &&
      Number(l.total_columns) === Number(layoutData.total_columns) &&
      Number(l.floor_count) === Number(layoutData.floor_count) &&
      l.is_template === false
    );
    if (duplicate?.id) {
      await busService.updateBusLayout(selectedBusId, duplicate.id);
      const details = await seatService.getLayoutDetails(duplicate.id);
      if (details) {
        setLayout(details.layout);
        setPositions(details.positions);
      }
      setIsModalOpen(false);
      alert(`Đã gán sơ đồ có sẵn "${duplicate.layout_name}" cho xe, không tạo bản ghi trùng.`);
      return;
    }
    const layoutPayload: Partial<BusLayout> = {
      ...layoutData,
      ...(isBusCompany && busCompanyId ? { bus_company_id: busCompanyId } : {}),
      is_template: false,
    };

    // Generate initial positions for Driver and Door
    const initialPositions: Partial<SeatPosition>[] = [];
    const cols = layoutData.total_columns || 4; // Default to 4 if not set

    // Driver at (1, 1) on Floor 1
    initialPositions.push({
      floor: 1,
      row_index: 1,
      column_index: 1,
      is_driver_seat: true,
      label: 'Tài'
    });

    // Door at (1, Last Column) on Floor 1
    initialPositions.push({
      floor: 1,
      row_index: 1,
      column_index: cols,
      is_door: true,
      label: 'Cửa'
    });

    const createdLayout = await seatService.createLayout(layoutPayload, initialPositions);
    if (createdLayout && createdLayout.id) {
      await busService.updateBusLayout(selectedBusId, createdLayout.id);
      
      setLayout(createdLayout);
      setPositions([]);
      setIsModalOpen(false);

      const updatedBuses = await busService.getAllBuses();
      const scopedBuses = isBusCompany
        ? (busCompanyId
            ? (updatedBuses || []).filter((bus) => {
                const companyId = bus.bus_company_id ?? bus.company_id;
                return companyId && String(companyId) === String(busCompanyId);
              })
            : [])
        : (updatedBuses || []);
      setBuses(scopedBuses);

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


        </div>

        {/* Main Content */}
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

          {/* RIGHT: Preview (Visualizing Floors) */}
          <div className='col-span-12 lg:col-span-9 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] p-8'>
            {selectedBusId && layout ? (
               <div className='flex justify-center gap-12 flex-wrap'>
                  {/* Floor 1 */}
                  <div className='flex flex-col items-center gap-4'>
                      <h3 className="text-gray-500 font-medium text-lg">Tầng dưới</h3>
                      <div className='bg-gray-100 rounded-[3rem] p-6 pb-12 w-[280px] min-h-[500px] relative flex flex-col items-center'>
                          


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
                        <div className='bg-gray-100 rounded-[3rem] p-6 pb-12 w-[280px] min-h-[500px] relative flex flex-col items-center pt-[5.5rem]'> {/* Added top padding to align with floor 1 content start */}
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
              <div className='h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]'>
                <i className="fa-solid fa-bus text-5xl mb-4 text-gray-200"></i>
                <p className="text-lg font-medium text-gray-400">Vui lòng chọn xe để xem sơ đồ</p>
                <p className="text-sm text-gray-300 mt-1">Chọn xe từ thanh công cụ phía trên</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Create Layout Modal */}
      <LayoutFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLayout}
        templates={templates}
      />
    </>
  );
}
