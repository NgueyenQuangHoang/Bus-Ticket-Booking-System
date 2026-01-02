import { useState, useEffect } from "react";
import ProfileSidebar from "../components/ProfileSidebar";

// MUI ICONS
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";



// MOCK DATA



import type { TicketUI } from "../../../../services/ticketService";
import { ticketService } from "../../../../services/ticketService";
import { reviewService } from "../../../../services/reviewService";
import ReviewModal from "./components/ReviewModal";
import Swal from "sweetalert2";

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<"current" | "past" | "cancelled">("current");
  const [tickets, setTickets] = useState<TicketUI[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketUI | null>(null);

  // Hardcoded user ID for demo purposes as requested
  const CURRENT_USER_ID = "bba5"; 

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const data = await ticketService.getMyTickets(CURRENT_USER_ID);
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [CURRENT_USER_ID]);

  const handleOpenReview = (ticket: TicketUI) => {
    setSelectedTicket(ticket);
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async (data: any) => {
    try {
      // Ensure data uses correct user_id
      const reviewPayload = {
        ...data,
        user_id: CURRENT_USER_ID,
      };

      if (selectedTicket?.review) {
        // UPDATE EXISTING REVIEW
        await reviewService.updateReview(selectedTicket.review.id, reviewPayload);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã cập nhật đánh giá thành công!",
          confirmButtonColor: "#1295DB",
        });
      } else {
        // CREATE NEW REVIEW
        await reviewService.createReview(reviewPayload);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã gửi đánh giá thành công!",
          confirmButtonColor: "#1295DB",
        });
      }
      
      setIsReviewOpen(false);
      // Refresh tickets to update review status
      const updatedTickets = await ticketService.getMyTickets(CURRENT_USER_ID);
      setTickets(updatedTickets);

    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Gửi đánh giá thất bại. Vui lòng thử lại.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const getFilteredTickets = () => {
    switch (activeTab) {
      case "current":
        return tickets.filter((t) => t.status === "BOOKED");
      case "past":
        return tickets.filter((t) => t.status === "COMPLETED");
      case "cancelled":
        return tickets.filter((t) => t.status === "CANCELLED");
      default:
        return [];
    }
  };

  const filteredTickets = getFilteredTickets();

  if (loading) {
    return (
        <section className="bg-[#f5f7fa] min-h-screen">
             <div className="max-w-[1024px] mx-auto px-3 py-6 text-center text-gray-500">
                Đang tải vé của bạn...
             </div>
        </section>
    );
  }

  const handleDeleteReview = async () => {
    if (!selectedTicket?.review) return;

    try {
        await reviewService.deleteReview(selectedTicket.review.id);
        
        Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đã xoá đánh giá thành công!",
            confirmButtonColor: "#1295DB",
        });

        setIsReviewOpen(false);
        // Refresh tickets
        const updatedTickets = await ticketService.getMyTickets(CURRENT_USER_ID);
        setTickets(updatedTickets);
    } catch (error) {
        console.error("Error deleting review:", error);
         Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Xoá đánh giá thất bại. Vui lòng thử lại.",
            confirmButtonColor: "#d33",
        });
    }
  };

  return (
    <section className="bg-[#f5f7fa] min-h-screen">
      <div
        className="
          max-w-[1024px] mx-auto
          px-3 py-6
          [@media(min-width(391px)]:px-4
          [@media(min-width(769px)]:px-0
        "
      >
        <div
          className="
            grid gap-6
            grid-cols-1
            [@media(min-width(391px)]:grid-cols-[260px_1fr]
            items-start
          "
        >
          {/* SIDEBAR */}
          <ProfileSidebar />

          {/* CONTENT */}
          <div className="space-y-4">
            {/* TABS */}
            <div className="bg-white rounded-xl p-1.5 flex shadow-sm border border-gray-100 mb-6">
              <button
                onClick={() => setActiveTab("current")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "current"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                Vé hiện tại
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "past"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                Chuyến đã đi
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "cancelled"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                Vé đã huỷ
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-5">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm border border-gray-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ConfirmationNumberIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Chưa có vé nào</h3>
                  <p className="text-sm text-gray-400">Bạn chưa có chuyến đi nào trong danh mục này.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* LEFT: TIME & DATE */}
                        <div className="md:w-48 flex-shrink-0 flex flex-col justify-center border-r border-gray-100 pr-6 md:border-b-0 border-b md:pb-0 pb-4">
                             <div className="text-2xl font-bold text-gray-800 leading-none mb-1">
                                {ticket.busInfo.time}
                             </div>
                             <div className="text-sm text-gray-500 font-medium mb-3">
                                {ticket.busInfo.date}
                             </div>
                             
                             <div className="flex items-center gap-2">
                                {ticket.status === "COMPLETED" && (
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-bold text-center w-max">
                                        Đã đi
                                    </span>
                                )}
                                {ticket.status === "BOOKED" && (
                                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded-md font-bold text-center w-max">
                                        Sắp đi
                                    </span>
                                )}
                                {ticket.status === "CANCELLED" && (
                                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs rounded-md font-bold text-center w-max">
                                        Đã huỷ
                                    </span>
                                )}
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-bold text-center w-max">
                                    Đã thanh toán
                                </span>
                             </div>
                        </div>

                        {/* MIDDLE: INFO */}
                        <div className="flex-1">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#1295DB] transition-colors">{ticket.busInfo.name}</h3>
                                <div className="text-lg font-bold text-[#1295DB]">
                                    {ticket.busInfo.price.toLocaleString()}đ
                                </div>
                             </div>
                             
                             <p className="text-sm text-gray-600 font-medium mb-4">{ticket.busInfo.route}</p>
                             
                             <div className="bg-gray-50 rounded-lg p-3 flex flex-col sm:flex-row gap-4 text-sm mb-4 border border-gray-100">
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Điểm đón</div>
                                    <div className="font-semibold text-gray-700">{ticket.pickup}</div>
                                </div>
                                <div className="hidden sm:block w-[1px] bg-gray-200"></div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Điểm trả</div>
                                    <div className="font-semibold text-gray-700">{ticket.dropoff}</div>
                                </div>
                             </div>

                             <div className="flex justify-between items-end">
                                <div className="text-xs text-gray-400">
                                    <span className="block mb-0.5">Mã vé: <span className="font-mono font-medium text-gray-600">{ticket.code}</span></span>
                                    <span className="block">Loại xe: <span className="font-medium text-gray-600">{ticket.busInfo.type}</span></span>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                                        Chi tiết
                                    </button>
                                    {ticket.status === "COMPLETED" && (
                                        <button 
                                            onClick={() => handleOpenReview(ticket)}
                                            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all ${
                                                ticket.review 
                                                    ? "bg-orange-500 hover:bg-orange-600" 
                                                    : "bg-[#1295DB] hover:bg-[#0b84c7]"
                                            }`}
                                        >
                                            {ticket.review ? "Sửa đánh giá" : "Viết nhận xét"}
                                        </button>
                                    )}
                                </div>
                             </div>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* PAGINATION MOCK */}
             {filteredTickets.length > 0 && (
                 <div className="flex justify-center gap-2 mt-8">
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">&lt;</button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1295DB] text-white font-bold shadow-sm">1</button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">2</button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">&gt;</button>
                 </div>
             )}

          </div>
        </div>
      </div>
      
      {/* REVIEW MODAL */}
      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        onSubmit={handleSubmitReview}
        ticket={selectedTicket}
        initialData={selectedTicket?.review}
        onDelete={handleDeleteReview}
      />
    </section>
  );
}
