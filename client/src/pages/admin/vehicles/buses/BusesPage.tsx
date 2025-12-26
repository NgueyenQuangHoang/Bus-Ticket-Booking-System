import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BusFormModal from "./components/BusFormModal";
import BusSearch from "./components/BusSearch";
import BusTable from "./components/BusTable";
import type { Bus } from "../../../../types";

const DATA: Bus[] = [
  {
    bus_id: 1,
    name: "FUTA-VIP01",
    license_plate: "51B-12345",
    company_id:1,
  }
  
];

export default function BusesPage() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <section className="bg-[#f5f7fa] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-6">

          {/* ===== HEADER ===== */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Quản lý xe</h1>
              <p className="text-sm text-gray-500">  {DATA.length} xe
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
              Thêm xe
            </button>
          </div>

          {/* ===== SEARCH (ROUNDED TOP) ===== */}
         <BusSearch data={DATA} />

          {/* ===== DESKTOP LIST (GRID) ===== */}
         <BusTable data={DATA} onDelete={() => {}} onEdit={() => {}}/>
        </div>
      </section>

      {/* ===== MODAL ===== */}
      <BusFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
