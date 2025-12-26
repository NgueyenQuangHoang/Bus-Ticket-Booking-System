import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import BusSelect from "./components/BusSelect";
import BusImageTable from "./components/BusImageTable";
import BusImageUploadModal from "./components/BusImageUploadModal";

const DATA = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    bus: "FUTA-VIP01 - 51B-12345",
  },
  {
    id: 21,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c5",
    bus: "FUTA-VIP02 - 51B-123222245",
  }, 
   {
    id: 3,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    bus: "FUTA-VIP031 - 51B-345",
  }, 
   {
    id: 12,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
    bus: "FUTA-VIP022 - 53A-12345",
  }
];

export default function BusImagesPage() {
  const [selectedBus, setSelectedBus] = useState(
    "FUTA-VIP01 - 51B-12345"
  );
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quản lý hình ảnh xe</h1>
            <p className="text-sm text-gray-500">
              Thư viện ảnh cho từng xe
            </p>
          </div>
           <div>
         
            </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Tải ảnh lên
          </button>
        </div>

        {/* SELECT BUS */}
        <BusSelect 
          value={selectedBus}
          onChange={setSelectedBus}
        />

        {/* TABLE */}
        <BusImageTable
          data={DATA.filter((i) => i.bus === selectedBus)}
        />

        {/* MODAL */}
        <BusImageUploadModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          bus={selectedBus}
        />
      </div>
    </section>
  );
}
