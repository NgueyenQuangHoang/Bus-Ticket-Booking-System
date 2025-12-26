import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import BusCompanyFormModal from "./components/BusCompanyFormModal";
import BusCompanySearch from "./components/BusCompanySearch";
import type { BusCompany } from "../../../../types/bus";
import BusCompanyTable from "./components/BusCompanyTable";

 export const DATA: BusCompany[] = [
    {
        bus_company_id: 1,
        company_name: "Phương Trang FUTA",
        license_number: "LIC-001",
        contact_phone: "02838386852",
        contact_email: "futa@gmail.com",
        address: "TP.HCM",
        status: "ACTIVE",
    },
    {
        bus_company_id: 2,
        company_name: "Hoàng Long",
        license_number: "LIC-002",
        contact_phone: "02838729279",
        contact_email: "hoanglong@gmail.com",
        address: "Hà Nội",
        status: "ACTIVE",
    },
];

export default function BusCompaniesPage() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <section className="bg-[#f5f7fa] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 py-6">

                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Quản lý nhà xe</h1>
                        <p className="text-sm text-gray-500">
                            {DATA.length} nhà xe
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="
              flex items-center gap-1
              bg-blue-600 text-white
              px-4 py-2 text-sm
              rounded-xl
              border border-blue-700
              hover:bg-blue-700
              transition
            "
                    >
                        <AddIcon sx={{ fontSize: 18 }} />
                        Thêm nhà xe
                    </button>
                </div>

                {/* ===== SEARCH (COMPONENT – TOP ROUNDED) ===== */}
                <BusCompanySearch data={DATA} />

                {/* ===== TABLE (DESKTOP – BOTTOM ROUNDED) ===== */}

                <BusCompanyTable
                    data={DATA}
                    onEdit={() => setOpenModal(true)}
                    onDelete={(item) => {
                        console.log("Delete:", item);
                    }}
                />


                {/* ===== MOBILE CARD ===== */}

            </div>

            {/* ===== MODAL ===== */}
            <BusCompanyFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </section>
    );
}
