import { useState, useEffect, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { Pagination } from "@mui/material";

import BusFormModal from "./components/BusFormModal";
import BusSearch from "./components/BusSearch";
import BusTable from "./components/BusTable";
import type { Bus, BusCompany, BusLayout } from "../../../../types";
import busService from "../../../../services/admin/busService";
import { busCompanyService } from "../../../../services/busCompanyService";
import { vehicleTypeService } from "../../../../services/vehicleTypeService";
import { busImageService } from "../../../../services/admin/busImageService";
import type { VehicleType } from "../../../../services/vehicleTypeService";
import { getStoredBusCompanyId, getStoredRole } from "../../../../utils/authStorage";


export default function BusesPage() {
    const isBusCompany = getStoredRole() === "BUS_COMPANY";
    const busCompanyId = getStoredBusCompanyId();

    const [buses, setBuses] = useState<Bus[]>([]);
    const [companies, setCompanies] = useState<BusCompany[]>([]);
    const [layouts, setLayouts] = useState<BusLayout[]>([]);
    // All layouts (including non-template clones) used for table enrichment
    const [allLayouts, setAllLayouts] = useState<BusLayout[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [busesData, companiesData, layoutsData, typesData] = await Promise.all([
                busService.getAllBuses(),
                busCompanyService.getAllBusCompanies(),
                busService.getAllBusLayoutsAll(),
                vehicleTypeService.getAllVehicleTypes()
            ]);

            const scopedBuses = isBusCompany
                ? (busCompanyId
                    ? (busesData || []).filter((bus) => {
                        const companyId = bus.bus_company_id ?? bus.company_id;
                        return companyId && String(companyId) === String(busCompanyId);
                      })
                    : [])
                : (busesData || []);

            const scopedCompanies = isBusCompany
                ? (busCompanyId
                    ? (companiesData || []).filter((company) => {
                        const companyId = company.id;
                        return companyId && String(companyId) === String(busCompanyId);
                      })
                    : [])
                : (companiesData || []);

            // Only template layouts (is_template=1) for the dropdown choices
            // MySQL returns is_template as 1/0 (number), not true/false
            const templateLayouts = (layoutsData || []).filter((layout) => !!layout.is_template);

            const scopedLayouts = isBusCompany
                ? (busCompanyId
                    ? templateLayouts.filter((layout) => {
                        const layoutCompanyId = layout.bus_company_id ?? layout.company_id;
                        if (!layoutCompanyId) {
                            return true; // global template available to all bus companies
                        }
                        return String(layoutCompanyId) === String(busCompanyId);
                      })
                    : [])
                : templateLayouts;

            setBuses(scopedBuses);
            setCompanies(scopedCompanies);
            setLayouts(scopedLayouts);
            setAllLayouts(layoutsData || []);
            setVehicleTypes(typesData || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
            Swal.fire("Lỗi", "Không thể tải dữ liệu", "error");
        } finally {
            setLoading(false);
        }
    }, [isBusCompany, busCompanyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Enrich bus data with names
    const enrichedBuses = buses.map(bus => {
        const company = companies.find(c => {
            const busCoId = bus.company_id ?? bus.bus_company_id;
            return busCoId && String(c.id) === String(busCoId);
        });
        // Use allLayouts (includes clones) so buses with non-template layout_ids still resolve
        const layout = allLayouts.find(l => String(l.layout_id) === String(bus.layout_id) || String(l.id) === String(bus.layout_id));
        const type = vehicleTypes.find(v => String(v.id) === String(bus.vehicle_type_id) || String(v.code) === String(bus.vehicle_type_id)); // Handle inconsistent ID usage if any

        return {
            ...bus,
            company_name: company?.company_name || "N/A",
            seat_layout: layout?.layout_name || "N/A",
            bus_type: type?.display_name || "N/A",
            total_rows: layout?.total_rows || 0,
            total_columns: layout?.total_columns || 0,
            floor_count: layout?.floor_count || 1,
        };
    });

    const handleCreate = () => {
        setSelectedBus(null);
        setOpenModal(true);
    };

    const handleEdit = (bus: Bus) => {
        setSelectedBus(bus);
        setOpenModal(true);
    };

    const handleDelete = async (bus: Bus) => {
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

    const handleSubmit = async (data: Partial<Bus>, thumbnailFile?: File) => {
        try {
            let uploadedThumbnail = "";

            // 1. Upload thumbnail if present
            if (thumbnailFile) {
                uploadedThumbnail = await busImageService.uploadFileToCloudinary(thumbnailFile);
            }

            // 2. Prepare data
            const busData = { ...data };
            if (uploadedThumbnail) {
                busData.thumbnail_image = uploadedThumbnail;
            }

            // 3. If a global layout is selected, prompt manager to name the clone
            if (busData.layout_id && busData.bus_company_id) {
                const selectedLayout = allLayouts.find(
                    (l) => String(l.id || l.layout_id) === String(busData.layout_id)
                );
                const isGlobal = selectedLayout && !selectedLayout.bus_company_id && !(selectedLayout as any).company_id;
                if (isGlobal && selectedLayout) {
                    const { value: cloneName, isConfirmed } = await Swal.fire({
                        title: 'Tùy chỉnh layout cho nhà xe',
                        text: 'Đây là layout mẫu chung. Đặt tên cho bản sao của nhà xe bạn:',
                        input: 'text',
                        inputLabel: 'Tên layout',
                        inputValue: selectedLayout.layout_name,
                        showCancelButton: true,
                        confirmButtonText: 'Tạo bản sao',
                        cancelButtonText: 'Hủy',
                        inputValidator: (v) => (!v?.trim() ? 'Vui lòng nhập tên layout' : null),
                    });
                    if (!isConfirmed) return; // user cancelled the whole action
                    const name = cloneName?.trim() || selectedLayout.layout_name;
                    const cloned = await busService.cloneLayout(
                        String(selectedLayout.id || selectedLayout.layout_id),
                        String(busData.bus_company_id),
                        name
                    );
                    busData.layout_id = (cloned as any).id || (cloned as any).layout_id;
                }
            }

            if (selectedBus) {
                await busService.updateBus(String(selectedBus.id || selectedBus.bus_id), busData);
                Swal.fire("Thành công", "Cập nhật xe thành công", "success");
            } else {
                await busService.createBus(busData as Omit<Bus, 'bus_id' | 'id'>);
                Swal.fire("Thành công", "Thêm xe thành công", "success");
            }
            fetchData();
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to save bus", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi lưu thông tin", "error");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Filter Logic
    const filteredData = enrichedBuses.filter(bus => 
        (bus.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (bus.license_plate?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        bus.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.bus_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setPage(1);
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
                    <BusSearch 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        total={filteredData.length}
                    />

                    {/* ===== TABLE ===== */}
                    {loading ? (
                        <div className="text-center py-10">Đang tải...</div>
                    ) : (
                        <>
                            <BusTable
                                data={paginatedData}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                             {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="flex justify-end mt-4">
                                    <Pagination 
                                        count={totalPages}
                                        page={page}
                                        onChange={(_event, value: number) => setPage(value)}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </div>
                            )}
                        </>
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
                vehicleTypes={vehicleTypes}
                layouts={layouts}
                isBusCompany={isBusCompany}
                busCompanyId={busCompanyId}
            />
        </>
    );
}
