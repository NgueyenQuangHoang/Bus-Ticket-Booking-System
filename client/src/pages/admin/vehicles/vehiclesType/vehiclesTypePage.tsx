import React, { useState, useEffect } from "react";
import { vehicleTypeService, type VehicleType } from "../../../../services/vehicleTypeService";
import VehicleTypeTable from "./components/VehicleTypeTable";
import VehicleTypeModal from "./components/VehicleTypeModal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";

export default function VehiclesTypePage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await vehicleTypeService.getAllVehicleTypes();
      if (data) {
        setVehicleTypes(data);
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicle types", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = vehicleTypes.filter(item => 
      item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
    setPage(1); // Reset to first page on search
  }, [searchTerm, vehicleTypes]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAdd = () => {
    setSelectedType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: VehicleType) => {
    setSelectedType(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await vehicleTypeService.deleteVehicleType(id);
                setVehicleTypes(prev => prev.filter(item => item.id !== id));
                Swal.fire(
                  'Đã xóa!',
                  'Loại xe đã được xóa thành công.',
                  'success'
                )
            } catch (error) {
                Swal.fire(
                    'Lỗi!',
                    'Không thể xóa loại xe.',
                    'error'
                )
            }
        }
      })
  };

  const handleSubmit = async (data: VehicleType) => {
    try {
        if (selectedType) {
            // Update
            const updated = await vehicleTypeService.updateVehicleType(data.id as string, data);
            setVehicleTypes(prev => prev.map(item => item.id === updated.id ? updated : item));
            Swal.fire('Thành công', 'Cập nhật loại xe thành công', 'success');
        } else {
            // Create
            // data now comes with id generated from modal
            const created = await vehicleTypeService.createVehicleType(data);
            setVehicleTypes(prev => [created, ...prev]);
            Swal.fire('Thành công', 'Thêm loại xe thành công', 'success');
        }
        setIsModalOpen(false);
    } catch (error) {
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi lưu dữ liệu', 'error');
    }
  };

  return (
    <section 
        className="bg-[#f5f7fa] min-h-screen p-6 animate-in fade-in duration-500"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý loại xe</h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý các loại xe trong hệ thống ({vehicleTypes.length} loại)
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1
                bg-blue-600 text-white
                px-4 py-2 text-sm
                rounded-xl
                border border-blue-700
                hover:bg-blue-700
                transition
                hover:cursor-pointer"
          >
            <AddIcon fontSize="small" />
            <span className="font-medium">Thêm loại xe</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên hoặc mã loại xe..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Table */}
        {loading ? (
             <div className="flex justify-center items-center h-48">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
        ) : (
            <VehicleTypeTable
              data={paginatedData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
        )}

        {/* Modal */}
        <VehicleTypeModal
          open={isModalOpen}
          initialData={selectedType}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
