import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BusFormModal from "./components/BusFormModal";
import BusSearch from "./components/BusSearch";
import BusTable from "./components/BusTable";
import type { Bus } from "../../../../types";

/**
 * Fake data phục vụ UI
 * Không ảnh hưởng backend
 */
type BusUI = Bus & {
  company_name?: string;
  bus_type?: string;
  seat_layout?: string;
  status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
};

const DATA: BusUI[] = [
  {
    bus_id: 1,
    company_id: 1,
    name: "FUTA-LIMO-01",
    license_plate: "51B-12345",
    company_name: "Phương Trang FUTA",
    bus_type: "Limousine",
    seat_layout: "22 ghế (1 tầng)",
    capacity: 22,
    status: "ACTIVE",
  },
  {
    bus_id: 2,
    company_id: 1,
    name: "FUTA-GN-01",
    license_plate: "51B-67890",
    company_name: "Phương Trang FUTA",
    bus_type: "Giường nằm",
    seat_layout: "40 giường (2 tầng)",
    capacity: 40,
    status: "ACTIVE",
  },
  {
    bus_id: 3,
    company_id: 2,
    name: "HL-GHE-01",
    license_plate: "29B-22222",
    company_name: "Hoàng Long",
    bus_type: "Ghế ngồi",
    seat_layout: "45 ghế (1 tầng)",
    capacity: 45,
    status: "MAINTENANCE",
  },
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
              <p className="text-sm text-gray-500">
                {DATA.length} xe
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

          {/* ===== SEARCH ===== */}
          <BusSearch data={DATA} />

          {/* ===== TABLE ===== */}
          <BusTable
            data={DATA}
            onEdit={(bus) => console.log("Edit:", bus)}
            onDelete={(bus) => console.log("Delete:", bus)}
          />
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
