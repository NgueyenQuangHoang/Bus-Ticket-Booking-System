import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

import BusFormModal from "./components/BusFormModal";
import BusSearch from "./components/BusSearch";
import BusTable from "./components/BusTable";
import type { Bus, BusCompany, BusLayout } from "../../../../types";
import busService from "../../../../services/admin/busService";
import { busCompanyService } from "../../../../services/busCompanyService";
import { vehicleTypeService } from "../../../../services/vehicleTypeService";
import type { VehicleType } from "../../../../services/vehicleTypeService";


export default function BusesPage() {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [companies, setCompanies] = useState<BusCompany[]>([]);
    const [layouts, setLayouts] = useState<BusLayout[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [busesData, companiesData, layoutsData, typesData] = await Promise.all([
                busService.getAllBuses(),
                busCompanyService.getAllBusCompanies(),
                busService.getAllBusLayouts(),
                vehicleTypeService.getAllVehicleTypes()
            ]);

            setBuses(busesData || []);
            setCompanies(companiesData || []);
            setLayouts(layoutsData || []);
            setVehicleTypes(typesData || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
            Swal.fire("Lỗi", "Không thể tải dữ liệu", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Enrich bus data with names
    const enrichedBuses = buses.map(bus => {
        const company = companies.find(c => c.bus_company_id === (bus.bus_company_id || bus.company_id));
        // Compare with both string and number representations just in case
        const layout = layouts.find(l => String(l.layout_id) === String(bus.layout_id) || String(l.id) === String(bus.layout_id));
        const type = vehicleTypes.find(v => String(v.id) === String(bus.vehicle_type_id) || String(v.code) === String(bus.vehicle_type_id)); // Handle inconsistent ID usage if any

        return {
            ...bus,
            company_name: company?.company_name || "N/A",
            seat_layout: layout?.layout_name || "N/A",
            bus_type: type?.display_name || "N/A"
        };
    });

    const handleCreate = () => {
        setSelectedBus(null);
        setOpenModal(true);
    };

    const handleEdit = (bus: any) => {
        // bus from table might have extra props, but we pass it as initialData which is compatible
        setSelectedBus(bus);
        setOpenModal(true);
    };

    const handleDelete = async (bus: any) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc muốn xóa xe "${bus.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                await busService.deleteBus(String(bus.id || bus.bus_id));
                Swal.fire("Đã xóa!", "Xe đã được xóa.", "success");
                fetchData();
            } catch (error) {
                console.error("Failed to delete bus", error);
                Swal.fire("Lỗi", "Không thể xóa xe", "error");
            }
        }
    };

    const handleSubmit = async (data: Partial<Bus>) => {
        try {
            if (selectedBus) {
                await busService.updateBus(String(selectedBus.id || selectedBus.bus_id), data);
                Swal.fire("Thành công", "Cập nhật xe thành công", "success");
            } else {
                await busService.createBus(data as any);
                Swal.fire("Thành công", "Thêm xe thành công", "success");
            }
            fetchData();
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to save bus", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi lưu thông tin", "error");
        }
    };

    return (
        <>
            <section className="bg-[#f5f7fa] min-h-screen">
                <div className="max-w-[1200px] mx-auto px-4 py-6">
                    {/* ===== HEADER ===== */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Quản lý xe</h1>
                            <p className="text-sm text-gray-500">
                                {buses.length} xe
                            </p>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="
                flex items-center gap-1
                bg-blue-600 text-white
                px-4 py-2 text-sm
                rounded-xl
                border border-blue-700
                hover:bg-blue-700
                transition
                hover:cursor-pointer
              "
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                            Thêm xe
                        </button>
                    </div>

                    {/* ===== SEARCH ===== */}
                    <BusSearch data={enrichedBuses} />

                    {/* ===== TABLE ===== */}
                    {loading ? (
                        <div className="text-center py-10">Đang tải...</div>
                    ) : (
                        <BusTable
                            data={enrichedBuses}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </section>

            {/* ===== MODAL ===== */}
            <BusFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                initialData={selectedBus}
                busCompanies={companies}
            />
        </>
    );
}
