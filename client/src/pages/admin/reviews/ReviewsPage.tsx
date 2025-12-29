import { useState } from "react";
import type { Review } from "./components/BusReviewTable";
import BusReviewSearch from "./components/BusReviewSearch";
import BusReviewTable from "./components/BusReviewTable";
import BusEditModal from "./components/BusEditModal";


const DATA: Review[] = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    bus: "FUTA-VIP01",
    rating: 3,
    content: "Dịch vụ tốt",
    status: "HIDDEN",
  },
  {
    id: 2,
    user: "Trần Thị B",
    bus: "FUTA-VIP02",
    rating: 4,
    content: "Xe sạch sẽ",
    status: "VISIBLE",
  },
];

export default function ReviewsPage() {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  return (
    <section className="bg-[#f5f7fa] min-h-screen">
      <div className="w-full px-6 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Quản lý đánh giá</h1>
          <p className="text-sm text-gray-500">
            {DATA.length} đánh giá
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <BusReviewSearch total={DATA.length} />

          <BusReviewTable
            data={DATA}
            onEdit={(review) => {
              setSelectedReview(review);
              setOpenEdit(true);
            }}
          />
        </div>

        {/* MODAL */}
        <BusEditModal
          open={openEdit}
          review={selectedReview}
          onClose={() => setOpenEdit(false)}
        />

      </div>
    </section>
  );
}
