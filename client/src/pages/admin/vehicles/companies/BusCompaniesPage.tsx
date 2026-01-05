
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { Pagination } from "@mui/material";

import BusCompanyFormModal from "./components/BusCompanyFormModal";
import BusCompanySearch from "./components/BusCompanySearch";
import type { BusCompany } from "../../../../types/bus";
import BusCompanyTable from "./components/BusCompanyTable";
import { busCompanyService } from "../../../../services/busCompanyService";

export default function BusCompaniesPage() {
    const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<BusCompany | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBusCompanies = async () => {
        try {
            setLoading(true);
            const data = await busCompanyService.getAllBusCompanies();
            setBusCompanies(data || []);
        } catch (error) {
            console.error("Failed to fetch bus companies", error);
            Swal.fire("Lỗi", "Không thể tải danh sách nhà xe", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusCompanies();
    }, []);

    const handleCreate = () => {
        setSelectedCompany(null);
        setOpenModal(true);
    };

    const handleEdit = (company: BusCompany) => {
        setSelectedCompany(company);
        setOpenModal(true);
    };

    const handleDelete = async (company: BusCompany) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc muốn xóa nhà xe "${company.company_name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                // Prioritize string ID, fallback to number ID if API supports it or strict string is needed
                await busCompanyService.deleteBusCompany(String(company.id));
                Swal.fire("Đã xóa!", "Nhà xe đã được xóa.", "success");
                fetchBusCompanies();
            } catch (error) {
                console.error("Failed to delete bus company", error);
                Swal.fire("Lỗi", "Không thể xóa nhà xe", "error");
            }
        }
    };

    const handleSubmit = async (data: Partial<BusCompany>) => {
        try {
            if (selectedCompany) {
                await busCompanyService.updateBusCompany(String(selectedCompany.id), data);
                Swal.fire("Thành công", "Cập nhật nhà xe thành công", "success");
            } else {
                await busCompanyService.createBusCompany(data as any);
                Swal.fire("Thành công", "Thêm nhà xe thành công", "success");
            }
            fetchBusCompanies();
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to save bus company", error);
            Swal.fire("Lỗi", "Có lỗi xảy ra khi lưu thông tin", "error");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // Or 10

    // Filter Logic
    const filteredData = busCompanies.filter(c => 
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.license_number.includes(searchTerm) ||
        (c.contact_phone && c.contact_phone.includes(searchTerm))
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
        <section className="bg-[#f5f7fa] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 py-6">

                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Quản lý nhà xe</h1>
                        <p className="text-sm text-gray-500">
                            {busCompanies.length} nhà xe
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
                        Thêm nhà xe
                    </button>
                </div>

                {/* ===== SEARCH (COMPONENT – TOP ROUNDED) ===== */}
                <BusCompanySearch 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    total={filteredData.length} 
                />

                {/* ===== TABLE (DESKTOP – BOTTOM ROUNDED) ===== */}

                {loading ? (
                    <div className="text-center py-10">Đang tải...</div>
                ) : (
                    <>
                        <BusCompanyTable
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


                {/* ===== MOBILE CARD ===== */}

            </div>

            {/* ===== MODAL ===== */}
            <BusCompanyFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                initialData={selectedCompany}
            />
        </section>
    );
}
