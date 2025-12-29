import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

import type { Bus, BusImage } from "../../../../types";
import { Pagination } from "@mui/material";
import BusSelect from "./components/BusSelect";
import BusImageTable from "./components/BusImageTable";
import BusImageUploadModal from "./components/BusImageUploadModal";
import busService from "../../../../services/admin/busService";
import { busImageService } from "../../../../services/admin/busImageService";

export default function BusImagesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | number>("");
  const [images, setImages] = useState<BusImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Fetch Buses
  useEffect(() => {
    const fetchBuses = async () => {
        try {
            const data = await busService.getAllBuses();
            setBuses(data || []);
            if (data && data.length > 0) {
                 // Optionally select first bus if needed, or leave empty
                 // setSelectedBusId(data[0].id || data[0].bus_id); 
            }
        } catch (error) {
            console.error("Failed to fetch buses", error);
        }
    };
    fetchBuses();
  }, []);

  // Pagination State
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Images might use a grid, so 8 or 12 is good

  // Reset page when bus changes
  useEffect(() => {
    setPage(1);
  }, [selectedBusId]);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = images.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
  );


  // Fetch Images when Bus Selected
  const fetchImages = async (busId: string | number) => {
      if (!busId) return;
      try {
          setLoading(true);
          const data = await busImageService.getImagesByBusId(busId);
          setImages(data || []);
      } catch (error) {
          console.error("Failed to fetch images", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      if (selectedBusId) {
          fetchImages(selectedBusId);
      } else {
          setImages([]);
      }
  }, [selectedBusId]);

  const handleDelete = async (image: BusImage) => {
       const result = await Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn có chắc muốn xóa ảnh này?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
          try {
              await busImageService.deleteBusImage(String(image.id || image.bus_image_id));
              Swal.fire("Đã xóa!", "Ảnh đã được xóa.", "success");
              if (selectedBusId) fetchImages(selectedBusId);
          } catch (error) {
              console.error("Failed to delete image", error);
              Swal.fire("Lỗi", "Không thể xóa ảnh", "error");
          }
      }
  };

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
           
          <button
            onClick={() => {
                if (!selectedBusId) {
                    Swal.fire("Thông báo", "Vui lòng chọn xe trước khi tải ảnh", "info");
                    return;
                }
                setOpenModal(true);
            }}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Tải ảnh lên
          </button>
        </div>

        {/* SELECT BUS */}
        <BusSelect 
          value={selectedBusId}
          onChange={setSelectedBusId}
          buses={buses}
        />

        {/* TABLE */}
        {loading ? (
             <div className="text-center py-10">Đang tải ảnh...</div>
        ) : (
            <>
                <BusImageTable
                    data={paginatedImages}
                    onDelete={handleDelete}
                />
                 {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-end mt-4">
                        <Pagination 
                            count={totalPages}
                            page={page}
                            onChange={(_e, v) => setPage(v)}
                            color="primary"
                            shape="rounded"
                        />
                    </div>
                )}
            </>
        )}
       

        {/* MODAL */}
        <BusImageUploadModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          busId={selectedBusId}
          onUploadSuccess={() => selectedBusId && fetchImages(selectedBusId)}
        />
      </div>
    </section>
  );
}
