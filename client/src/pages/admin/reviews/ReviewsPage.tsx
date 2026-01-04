import { useState, useEffect } from "react";
import { reviewService, type Review } from "../../../services/reviewService";
import BusReviewSearch from "./components/BusReviewSearch";
import BusReviewTable from "./components/BusReviewTable";
import BusEditModal from "./components/BusEditModal";
import Swal from 'sweetalert2';
import { getStoredRole, getStoredBusCompanyId } from "../../../utils/authStorage";
import busService from "../../../services/admin/busService";

export default function ReviewsPage() {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  // Data State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchReviews = async () => {
    setLoading(true);
    try {
        const role = getStoredRole();
        let busIds: string[] = [];

        if (role === "BUS_COMPANY") {
            const companyId = getStoredBusCompanyId();
            if (companyId) {
                const buses = await busService.getBusesByCompanyId(companyId);
                busIds = buses.map(b => String(b.id)); // ensure string id
            }
        }

        const response = await reviewService.getAllReviews(page, limit, search, busIds);
        setReviews(response.data);
        setTotal(response.total);
    } catch (error) {
        console.error("Failed to fetch reviews", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search could be added here if needed, but for now direct effect
    const timer = setTimeout(() => {
        setPage(1); // Reset to page 1 on search
        fetchReviews();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
     fetchReviews();
  }, [page]);

  const handleEdit = (review: Review) => {
      setSelectedReview(review);
      setOpenEdit(true);
  };

  const handleSaveReview = async (id: string, updates: Partial<Review>) => {
      try {
          await reviewService.updateReview(id, updates);
          Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Đã cập nhật đánh giá!',
              timer: 1500,
              showConfirmButton: false
          });
          fetchReviews(); // Refresh list
      } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể cập nhật đánh giá.'
          });
      }
  };

  const handleDeleteReview = async (id: string) => {
      try {
          await reviewService.deleteReview(id);
          Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Đã xoá đánh giá!',
              timer: 1500,
              showConfirmButton: false
          });
          fetchReviews(); 
      } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể xoá đánh giá.'
          });
          console.error(error);
      }
  };

  const handleConfirmDelete = (id: string) => {
      Swal.fire({
          title: 'Xoá đánh giá?',
          text: "Hành động này không thể hoàn tác!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Xoá ngay',
          cancelButtonText: 'Hủy'
      }).then((result) => {
          if (result.isConfirmed) {
              handleDeleteReview(id);
          }
      });
  };

  return (
    <section className="bg-[#f5f7fa] min-h-screen p-6 font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đánh giá</h1>
              <p className="text-gray-500 mt-1">
                Xem và kiểm duyệt đánh giá từ hành khách
              </p>
          </div>

        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <BusReviewSearch total={total} onSearch={setSearch} />

          {loading ? (
             <div className="p-12 flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
             </div>
          ) : (
            <>
                <BusReviewTable
                    data={reviews}
                    onEdit={handleEdit}
                    onDelete={handleConfirmDelete}
                />
                
                {/* Simple Pagination Control if needed */}
                {total > limit && (
                    <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 bg-gray-50 rounded">Trang {page}</span>
                        <button 
                            disabled={page * limit >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </>
          )}
        </div>

        {/* MODAL */}
        <BusEditModal
          open={openEdit}
          review={selectedReview}
          onClose={() => setOpenEdit(false)}
          onSave={handleSaveReview}
        />

      </div>
    </section>
  );
}
