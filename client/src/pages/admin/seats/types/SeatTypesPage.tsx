import { useEffect, useState, useCallback } from 'react';
import { Paper, Pagination } from '@mui/material';
import type { SeatType } from '../../../../types/seat';
import seatService from '../../../../services/admin/seatService';
import SeatTypeTable from './components/SeatTypeTable';
import SeatTypeFormModal from './components/SeatTypeFormModal';

export default function SeatTypesPage() {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchSeatTypes = useCallback(async () => {
    const data = await seatService.getAllSeatTypes();
    setSeatTypes(data || []);
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchSeatTypes();
    };
    init();
  }, [fetchSeatTypes]);

  const handleCreate = async (data: Partial<SeatType>) => {
    await seatService.createSeatType(data);
    fetchSeatTypes();
  };

  const handleUpdate = async (id: number | string, data: Partial<SeatType>) => {
    await seatService.updateSeatType(id, data);
    fetchSeatTypes();
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại ghế này?')) {
        await seatService.deleteSeatType(id);
        fetchSeatTypes();
    }
  };

  const filtered = seatTypes.filter(st => 
    st.type_name.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className='py-5 space-y-5'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Quản lý loại ghế</h1>
        <SeatTypeFormModal onSubmit={handleCreate} />
      </div>

      <Paper className='p-4 shadow-sm rounded-xl border border-gray-100 space-y-4'>
        <div className='flex items-center gap-2 border rounded-lg px-3 py-2 max-w-sm'>
             <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
             <input 
                type="text" 
                placeholder="Tìm loại ghế..." 
                className='outline-none w-full text-sm'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
        </div>

        <SeatTypeTable 
            seatTypes={displayed} 
            onUpdate={handleUpdate}
            onDelete={handleDelete}
        />
      </Paper>

      {totalPages > 1 && (
        <div className='flex justify-center'>
            <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(_, p) => setCurrentPage(p)} 
                color="primary"
            />
        </div>
      )}
    </div>
  );
}
