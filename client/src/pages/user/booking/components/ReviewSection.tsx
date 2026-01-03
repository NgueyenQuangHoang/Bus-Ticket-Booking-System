import { useState, useEffect } from "react";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import StarRateIcon from "@mui/icons-material/StarRate";
import VerifiedIcon from "@mui/icons-material/Verified";
import { reviewService, type Review } from "../../../../services/reviewService";
import api from "../../../../api/api";

interface ReviewSectionProps {
  busId: string;
}

// Map keys from Review["details"] to display labels
const RATING_LABELS: Record<string, string> = {
  safety: "An toàn",
  info_accuracy: "Thông tin chính xác",
  info_completeness: "Thông tin đầy đủ",
  staff_attitude: "Thái độ nhân viên",
  comfort: "Tiện nghi & thoải mái",
  service_quality: "Chất lượng dịch vụ",
  punctuality: "Đúng giờ",
};

interface EnrichedReview extends Review {
    routeName?: string;
    vehicleType?: string;
}

export default function ReviewSection({ busId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [_, setTotalCount] = useState(0);
  
  // Filters
  const [filterRating, setFilterRating] = useState<number | null>(null); // null for ALL
  const limit = 5;

  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    details: {} as Record<string, { score: number; percent: number }>,
  });

  // Fetch Stats (All reviews)
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await reviewService.getAllReviewsForStats(busId);
            const allReviews = response.filter((r: any) => r.status === "VISIBLE");
            const total = allReviews.length;
            
            if (total === 0) {
              setStats({
                averageRating: 0,
                totalReviews: 0,
                details: {},
              });
              return;
            }

            const sumRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = (sumRating / total).toFixed(1);

            /* Removed detailed stats calculation loop */

            // MOCK DETAILS STATS FOR UI ONLY
            const detailsStats: Record<string, { score: number; percent: number }> = {};
            Object.keys(RATING_LABELS).forEach(key => {
               // Randomize slightly between 4.5 and 5.0 for a good look, or just static 5.0
               // User asked for UI only, no calculation
               detailsStats[key] = {
                 score: 4.8,
                 percent: 96
               };
            });
            
            setStats({
                averageRating: Number(avg),
                totalReviews: total,
                details: detailsStats
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };
    if (busId) fetchStats();
  }, [busId]);

  // Fetch Reviews with Pagination and Filter
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewService.getReviewsByBusId(busId, currentPage, limit, filterRating);
        // Filter only VISIBLE reviews from the fetched data
        const fetchedReviews = response.data.filter((r: any) => r.status === "VISIBLE");
        
        // Enrich reviews with Route and Vehicle Info
        const enrichedReviews = await Promise.all(fetchedReviews.map(async (review) => {
             try {
                 let routeName = "";
                 let vehicleType = "";

                 if (review.ticket_id) {
                     const ticketRes = await api.get<any>(`/tickets/${review.ticket_id}`);
                     const ticket = ticketRes as any;

                     if (ticket && ticket.schedule_id) {
                         const scheduleRes = await api.get<any>(`/schedules/${ticket.schedule_id}`);
                         const schedule = scheduleRes as any;

                         if (schedule) {
                             if (schedule.route_id) {
                                 const routeRes = await api.get<any>(`/routes/${schedule.route_id}`);
                                 const route = routeRes as any;
                                 
                                 if (route) {
                                     const [depStation, arrStation] = await Promise.all([
                                         api.get<any>(`/stations/${route.departure_station_id}`),
                                         api.get<any>(`/stations/${route.arrival_station_id}`)
                                     ]);
                                     
                                      const depName = (depStation as any)?.station_name?.replace('Bến xe ', '') || "Điểm đi";
                                      const arrName = (arrStation as any)?.station_name?.replace('Bến xe ', '') || "Điểm đến";
                                      routeName = `${depName} - ${arrName}`;
                                 }
                             }
                             
                             if (schedule.bus_id) {
                                 const busRes = await api.get<any>(`/buses/${schedule.bus_id}`);
                                 const bus = busRes as any;
                                 if (bus) {
                                      vehicleType = bus.name || "Xe khách";
                                      if (vehicleType.includes('–')) {
                                          vehicleType = vehicleType.split('–')[1].trim(); 
                                      } else if (vehicleType.includes('-')) {
                                          vehicleType = vehicleType.split('-')[1].trim();
                                      }
                                 }
                             }
                         }
                     }
                 }
                 return { ...review, routeName, vehicleType };
             } catch (err) {
                 console.warn("Failed to enrich review", review.id, err);
                 return review;
             }
        }));

        setReviews(enrichedReviews);
        const total = response.total; 
        setTotalCount(total);
        setTotalPages(Math.ceil(total / limit));
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) fetchReviews();
  }, [busId, currentPage, filterRating]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterRating = (rating: number | null) => {
    setFilterRating(rating);
    setCurrentPage(1); 
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
  };

  // Helper to get initials
  const getInitials = (user?: any) => {
      // User might have first_name/last_name or full_name (if mock)
      // We know db has first_name/last_name
      if (user?.last_name && user?.first_name) {
          return (user.last_name[0] + user.first_name[0]).toUpperCase();
      }
      if (user?.full_name) {
          const parts = user.full_name.split(" ");
          if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          }
          return user.full_name.substring(0, 2).toUpperCase();
      }
      return "U";
  };
  
  const getUserName = (user?: any) => {
      if (!user) return "Người dùng ẩn danh";
      if (user.last_name && user.first_name) {
          return `${user.last_name} ${user.first_name}`;
      }
      return user.full_name || user.fullName || user.name || user.email || "Người dùng ẩn danh";
  }

  return (
    <div className="bg-white rounded-lg p-6 font-sans">
      {/* Header & Overall Rating */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
        {/* Left: Overall Score */}
        <div className="flex flex-col items-center justify-center min-w-[150px]">
             <div className="text-5xl font-extrabold text-[#1295DB] mb-2">{stats.averageRating}</div>
             <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                    <StarRateRoundedIcon 
                        key={i} 
                        className={i < Math.round(stats.averageRating) ? "text-yellow-400" : "text-gray-200"}
                        sx={{ fontSize: 24 }}
                    />
                ))}
             </div>
             <span className="text-gray-500 text-sm font-medium">{stats.totalReviews} đánh giá</span>
        </div>

        {/* Right: Detailed Progress Bars */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
             {Object.entries(RATING_LABELS).map(([key, label]) => {
                 const stat = stats.details[key] || { score: 0, percent: 0 };
                 return (
                     <div key={key} className="flex items-center gap-3 text-sm">
                         <span className="flex-1 text-gray-600 font-medium">{label}</span>
                         <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                                style={{ width: `${stat.percent}%` }}
                             />
                         </div>
                         <span className="w-8 text-right font-bold text-gray-700">{stat.score}</span>
                     </div>
                 );
             })}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => handleFilterRating(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
            filterRating === null
              ? "bg-[#1295DB] text-white shadow-blue-200"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
          }`}
        >
          Tất cả ({stats.totalReviews})
        </button>
        
        {[5, 4, 3, 2, 1].map(star => (
             <button
             key={star}
             onClick={() => handleFilterRating(star)}
             className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-1 ${
               filterRating === star
                 ? "bg-[#1295DB] text-white shadow-blue-200"
                 : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
             }`}
           >
             {star} Sao
           </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
             <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1295DB]"></div>
             </div>
        ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>Chưa có đánh giá nào phù hợp với bộ lọc này.</p>
            </div>
        ) : (
             reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-[#1295DB] font-bold text-lg shadow-sm border border-blue-100">
                        {getInitials(review.user)}
                      </div>
                    </div>
      
                    {/* Content */}
                    <div className="flex-1">
                      {/* User Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                            <span className="font-bold text-gray-900 block sm:inline mr-2">
                            {getUserName(review.user)}
                            </span>
                            <div className="inline-flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                <VerifiedIcon sx={{ fontSize: 12 }} />
                                <span className="font-medium">Đã đi ngày {formatDate(review.created_at)}</span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">Đăng ngày {formatDate(review.updated_at)}</span>
                      </div>
      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                            <StarRateIcon
                                key={i}
                                sx={{ fontSize: 16 }}
                                className={
                                i < review.rating ? "text-yellow-400" : "text-gray-200"
                                }
                            />
                            ))}
                        </div>
                        {review.rating >= 4 && <span className="text-xs font-semibold text-gray-600 px-2 py-0.5 bg-gray-100 rounded">Tuyệt vời</span>}
                      </div>
      
                      {/* Comment */}
                      <p className="text-gray-700 text-sm mb-3 whitespace-pre-line leading-relaxed">
                        {review.review}
                      </p>
                      
                      {/* Route Info & Vehicle Type */}
                      {(review.routeName || review.vehicleType) && (
                         <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                             {review.vehicleType && (
                                 <span className="flex items-center gap-1">
                                     <span className="font-medium text-gray-400">Loại xe:</span>
                                     <span className="text-gray-600 font-semibold">{review.vehicleType}</span>
                                 </span>
                             )}
                             {review.routeName && (
                                 <span className="flex items-center gap-1">
                                     <span className="font-medium text-gray-400">Tuyến đường:</span>
                                     <span className="text-gray-600 font-semibold">{review.routeName}</span>
                                 </span>
                             )}
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
        )}
       
      </div>
          
      {/* Pagination */}
      {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="text-sm">❮</span>
            </button>
            
             {[...Array(totalPages)].map((_, i) => {
                 const pageNum = i + 1;
                 if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                 ) {
                     return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg border font-medium transition-all shadow-sm ${
                                currentPage === pageNum 
                                ? "bg-[#1295DB] text-white border-[#1295DB]" 
                                : "bg-white border-gray-200 text-gray-600 hover:border-[#1295DB] hover:text-[#1295DB]"
                            }`}
                        >
                            {pageNum}
                        </button>
                     );
                 } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                 ) {
                     return <span key={pageNum} className="flex items-end px-1 text-gray-400">...</span>;
                 }
                 return null;
             })}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="text-sm">❯</span>
            </button>
      </div>
      )}

    </div>
  );
}
