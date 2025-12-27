import { useState, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";

import ScheduleTable, { type ScheduleUI } from "./components/ScheduleTable";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleSearch from "./components/ScheduleSearch";
import ScheduleModalForm from "./components/ScheduleModalForm";

// --- MOCK DATA GENERATOR ---
const generateMockData = (count: number): ScheduleUI[] => {
  return Array.from({ length: count }, (_, i) => ({
    schedule_id: i + 1,
    route_id: 101 + (i % 3),
    bus_id: 201 + (i % 3),
    route_name: [
      "Bến xe Miền Đông → Bến xe Mỹ Đình",
      "Bến xe Miền Đông → Bến xe Giáp Bát",
      "Bến xe Miền Tây → Bến xe Mỹ Đình",
    ][i % 3],
    bus_name: ["FUTA-VIP01", "FUTA-VIP02", "HL-001"][i % 3],
    bus_license: ["51B-12345", "51B-67890", "29B-99999"][i % 3],
    departure_time_str: `0${(i % 9) + 1}:30 2${(i % 5) + 5}/12/2025`,
    available_seat: (i % 5 === 0) ? 0 : 40 - (i % 10),
    total_seats: 40,
    status: i % 5 === 0 ? "FULL" : "AVAILABLE",
  }));
};

const INITIAL_DATA = generateMockData(50);

export default function SchedulesPage() {
  // Data State
  const [data, setData] = useState<ScheduleUI[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  // Modal State
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleUI | null>(null);

  // --- DERIVED DATA ---
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bus_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, page]);

  // --- HANDLERS ---

  // Create / Edit
  const handleOpenCreate = () => {
    setEditingItem(null);
    setOpenFormModal(true);
  };

  const handleOpenEdit = (item: ScheduleUI) => {
    setEditingItem(item);
    setOpenFormModal(true);
  };

  const handleFormSubmit = (formData: Partial<ScheduleUI>) => {
    if (editingItem) {
      // Update existing
      setData(prev => prev.map(item => 
        item.schedule_id === editingItem.schedule_id 
          ? { ...item, ...formData } as ScheduleUI
          : item
      ));
    } else {
      // Create new
      const newItem: ScheduleUI = {
        schedule_id: Math.max(...data.map(d => d.schedule_id)) + 1,
        ...formData,
      } as ScheduleUI;
      setData(prev => [newItem, ...prev]);
    }
    setOpenFormModal(false);
  };

  // Delete (using SweetAlert2)
  const handleDelete = (item: ScheduleUI) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc chắn muốn xóa lịch trình #${item.schedule_id} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa bỏ",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(prev => prev.filter(d => d.schedule_id !== item.schedule_id));
        Swal.fire("Đã xóa!", "Lịch trình đã được xóa thành công.", "success");
      }
    });
  };

  return (
    <div className="space-y-6">
       <ScheduleHeader 
         totalCount={filteredData.length} 
         onAddClick={handleOpenCreate} 
       />

       <ScheduleSearch 
         value={searchTerm} 
         onChange={setSearchTerm} 
       />

       <ScheduleTable
         data={paginatedData}
         onEdit={handleOpenEdit}
         onDelete={handleDelete}
       />

       {/* Pagination */}
       <div className="flex justify-end pt-4">
         <Stack spacing={2}>
           <Pagination 
             count={totalPages} 
             page={page} 
             onChange={(_, p) => setPage(p)}
             color="primary"
             shape="rounded"
             showFirstButton 
             showLastButton
           />
         </Stack>
       </div>

      {/* Form Modal */}
      <ScheduleModalForm
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        existingSchedules={data}
      />
    </div>
  );
}
