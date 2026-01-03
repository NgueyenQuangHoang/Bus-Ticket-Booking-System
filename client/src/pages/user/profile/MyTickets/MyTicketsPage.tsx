import { useState, useEffect } from "react";
import ProfileSidebar from "../components/ProfileSidebar";

// MUI ICONS
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Pagination from "@mui/material/Pagination";



// MOCK DATA



import type { TicketUI } from "../../../../services/ticketService";
import { ticketService } from "../../../../services/ticketService";
import { reviewService } from "../../../../services/reviewService";
import ReviewModal from "./components/ReviewModal";
import CancelTicketModal from "./components/CancelTicketModal";
import Swal from "sweetalert2";

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<"current" | "past" | "cancelled">("current");
  const [tickets, setTickets] = useState<TicketUI[]>([]);

  const [loading, setLoading] = useState(true);
  
  // PAGINATION MOCK turned REAL
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketUI | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState<TicketUI | null>(null);

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
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
     (currentPage - 1) * ITEMS_PER_PAGE, 
     currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
        <section className="bg-[#f5f7fa] min-h-screen">
             <div className="max-w-[1024px] mx-auto px-3 py-6 text-center text-gray-500">
                Đang tải vé của bạn...
             </div>
        </section>
    );
  }

  const formatDateParts = (dateStr: string) => {
    // Assuming dateStr is DD/MM/YYYY or similar
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return { day: parts[0], monthYear: `${parts[1]}/${parts[2]}` };
    }
    // Fallback if format is different (e.g. T7, ...)
    return { day: dateStr.split(',')[0], monthYear: dateStr };
  };

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

  const handleOpenCancel = (ticket: TicketUI) => {
    setTicketToCancel(ticket);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (ticketId: string) => {
    try {
      // API Call to cancel ticket
      await ticketService.cancelTicket(ticketId);

      // Show Success Message
      Swal.fire({
          icon: "success",
          title: "Hủy vé thành công!",
          text: "Vé đã được hủy và quy trình hoàn tiền đã bắt đầu.",
          confirmButtonColor: "#1295DB",
      });

      setIsCancelModalOpen(false);
      
      // Update local state to reflect change immediately
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: "CANCELLED" as const } : t
      ));

    } catch (error) {
       console.error("Error cancelling ticket:", error);
       Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Hủy vé thất bại. Vui lòng thử lại sau.",
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
          [@media(min-width:391px)]:px-4
          [@media(min-width:769px)]:px-0
        "
      >
        <div
          className="
            grid gap-6
            grid-cols-1
            [@media(min-width:391px)]:grid-cols-[260px_1fr]
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
                onClick={() => { setActiveTab("current"); setCurrentPage(1); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "current"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                }`}
              >
                Vé hiện tại
              </button>
              <button
                onClick={() => { setActiveTab("past"); setCurrentPage(1); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "past"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                }`}
              >
                Chuyến đã đi
              </button>
              <button
                onClick={() => { setActiveTab("cancelled"); setCurrentPage(1); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "cancelled"
                    ? "bg-[#1295DB] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
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
                paginatedTickets.map((ticket) => {
                  const { day, monthYear } = formatDateParts(ticket.busInfo.date);
                  return (
                    <div key={ticket.id} className="bg-white rounded-xl p-0 shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
                       <div className="flex flex-col md:flex-row">
                          {/* LEFT: DATE */}
                          <div className="w-full md:w-32 bg-gray-50 flex flex-row md:flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-200 gap-2 md:gap-0">
                               <div className="text-3xl md:text-4xl font-bold text-gray-800">{day}</div>
                               <div className="text-sm text-gray-500 font-medium">{monthYear}</div>
                          </div>

                          {/* MIDDLE: INFO */}
                          <div className="flex-1 p-5">
                               {/* HEADER: TIME & STATUS */}
                               <div className="flex flex-wrap items-center gap-3 mb-3">
                                   <div className="text-xl font-bold text-gray-800">{ticket.busInfo.time}</div>
                                   {ticket.status === "COMPLETED" && (
                                     <span className="px-2.5 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                        Đã đi
                                     </span>
                                   )}
                                   {ticket.status === "BOOKED" && (
                                      <span className="px-2.5 py-1 bg-green-100 text-green-600 text-xs rounded-full font-bold flex items-center gap-1">
                                         <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                         Sắp đi
                                      </span>
                                   )}
                                   {ticket.status === "CANCELLED" && (
                                      <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs rounded-full font-bold flex items-center gap-1">
                                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                          Đã huỷ
                                      </span>
                                   )}
                                   <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded-full font-bold border border-green-100">
                                       Đã thanh toán
                                   </span>
                               </div>

                               {/* BUS NAME & ROUTE */}
                               <div className="mb-4">
                                   <h3 className="font-bold text-lg text-gray-800 mb-1">{ticket.busInfo.name}</h3>
                                   <p className="text-gray-600">{ticket.busInfo.route}</p>
                               </div>

                               {/* LOCATION BOXES */}
                               <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                   <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                       <span className="text-xs text-gray-500 block mb-1">Đón</span>
                                       <span className="font-semibold text-gray-800 text-sm">{ticket.pickup}</span>
                                   </div>
                                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                       <span className="text-xs text-gray-500 block mb-1">Trả</span>
                                       <span className="font-semibold text-gray-800 text-sm">{ticket.dropoff}</span>
                                   </div>
                               </div>

                                {/* REVIEW STATUS OR MESSAGE */}
                                {ticket.review ? (
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex justify-between items-center text-sm">
                                        <span className="font-semibold text-gray-800">Bạn đã đánh giá chuyến đi này</span>
                                        <div className="flex items-center gap-1 text-orange-400 font-bold">
                                             <span>★</span>
                                             <span>{ticket.review.rating}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">
                                        Chưa có nhận xét. Chia sẻ trải nghiệm của bạn để giúp người khác chọn nhà xe phù hợp.
                                    </p>
                                )}
                          </div>

                          {/* RIGHT: PRICE & ACTIONS */}
                          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-200 p-5 flex flex-col justify-between bg-white md:bg-gray-50/30">
                               <div className="text-right mb-4 flex flex-row justify-between md:flex-col md:items-end">
                                   <div className="text-xl font-bold text-[#1295DB]">{ticket.busInfo.price.toLocaleString()}đ</div>
                                   <div className="text-xs text-gray-500 mt-1">Mã vé: <span className="font-medium text-gray-700">{ticket.code}</span></div>
                               </div>

                               <div className="space-y-1 text-xs text-gray-500 mb-6 hidden md:block text-right">
                                   <div>Loại xe: <span className="font-medium text-gray-700">{ticket.busInfo.type}</span></div>
                                   <div>Trạng thái: <span className="font-medium text-green-600">Hoàn thành</span></div>
                               </div>

                               <div className="flex flex-col gap-2">
                                   {ticket.status === "COMPLETED" && !ticket.review && (
                                       <button 
                                            onClick={() => handleOpenReview(ticket)}
                                            className="w-full py-2.5 bg-[#1295DB] hover:bg-[#0b84c7] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 hover:cursor-pointer"
                                       >
                                            <span className="text-lg pb-1">✎</span> Viết nhận xét
                                       </button>
                                   )}
                                   
                                   {ticket.status === "COMPLETED" && ticket.review && (
                                       <div className="w-full py-2.5 bg-green-100 text-gray-500 font-semibold rounded-lg text-center flex items-center justify-center gap-2 cursor-default">
                                            <span className="text-green-500">✓</span> Đã đánh giá
                                       </div>
                                   )}

                                   {ticket.status === "COMPLETED" && ticket.review && (
                                       <button 
                                            onClick={() => handleOpenReview(ticket)}
                                            className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm hover:cursor-pointer"
                                       >
                                            Xem nhận xét
                                       </button>
                                   )}

                                   <button className="w-full py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                        Chi tiết vé ›
                                   </button>

                                   {ticket.status === "BOOKED" && (
                                       <button 
                                            onClick={() => handleOpenCancel(ticket)}
                                            className="w-full py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors text-sm hover:cursor-pointer mt-1"
                                       >
                                            Hủy vé
                                       </button>
                                   )}
                               </div>
                          </div>
                       </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* PAGINATION */}
             {totalPages > 1 && (
                 <div className="flex justify-center mt-8">
                    <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={(_, value) => setCurrentPage(value)}
                        color="primary"
                        shape="rounded"
                        showFirstButton 
                        showLastButton
                    />
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

      {/* CANCEL TICKET MODAL */}
      <CancelTicketModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        ticket={ticketToCancel}
      />
    </section>
  );
}
