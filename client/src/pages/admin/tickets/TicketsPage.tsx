import { useState, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TicketHeader from "./components/TicketHeader";
import TicketSearch from "./components/TicketSearch";
import TicketTable, { type TicketUI } from "./components/TicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import Swal from "sweetalert2";

// --- MOCK DATA ---
const CUSTOMERS = [
    "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Minh F",
    "Đỗ Văn G", "Ngô Thị H", "Bùi Văn I", "Vũ Thị K", "Đinh Văn L"
];

const generateMockData = (count: number): TicketUI[] => {
  return Array.from({ length: count }, (_, i) => ({
    ticket_id: i + 1,
    ticket_code: `XC${String(i + 7000).padStart(5, '0')}`, // NEW: Display Code
    id: String(i + 7000), 
    user_id: 100 + i,
    schedule_id: (i % 20) + 1,
    seat_id: i + 1,
    seat_type: (i % 3 === 0) ? "Giường đôi" : (i % 3 === 1) ? "Giường đơn" : "Ghế ngồi",
    price: 200000 + (i % 5) * 50000,
    status: (i % 10 === 0) ? "USED" : (i % 7 === 0) ? "CANCELLED" : "BOOKED", // Added USED
    payment_status: (i % 7 === 0) ? "REFUNDED" : (i % 5 === 0) ? "PENDING" : "PAID", // Added Payment Status
    created_at: `${(i % 28) + 1}/12/2025`,
    updated_at: "2025-01-10",
    
    // UI Helpers (Enrichment)
    customer_name: CUSTOMERS[i % CUSTOMERS.length],
    trip_name: `${(i % 20) + 1}`,
  }));
};

const INITIAL_DATA = generateMockData(100);

export default function TicketsPage() {
  const [data, setData] = useState<TicketUI[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketUI | null>(null);
  const ROWS_PER_PAGE = 10;

  // Filter
  const filteredData = useMemo(() => {
    return data.filter(item => 
      (item.customer_name && item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.ticket_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.ticket_id).includes(searchTerm)
    );
  }, [data, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [filteredData, page]);

  // Handle Cancel Ticket
  const handleCancelTicket = () => {
    if (!selectedTicket) return;
    
    Swal.fire({
      title: "Xác nhận hủy vé?",
      text: "Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // red-500
      cancelButtonColor: "#64748b", // slate-500
      confirmButtonText: "Đồng ý hủy",
      cancelButtonText: "Đóng",
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = data.map(t => 
            t.ticket_id === selectedTicket.ticket_id 
            ? { ...t, status: "CANCELLED" as const } 
            : t
        );
        setData(newData);
        setSelectedTicket({ ...selectedTicket, status: "CANCELLED" });

        Swal.fire({
          title: "Đã hủy!",
          text: "Vé đã được hủy thành công.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <TicketHeader 
        totalCount={filteredData.length} 
        onExportClick={() => alert("Chức năng xuất báo cáo đang phát triển")}
      />

      <TicketSearch 
        value={searchTerm}
        onChange={(val) => { setSearchTerm(val); setPage(1); }}
      />

      <TicketTable 
        data={paginatedData}
        onView={(item) => setSelectedTicket(item)}
      />

       {/* Pagination */}
       <div className="flex justify-end pt-4">
          <Stack spacing={2}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
              showFirstButton 
              showLastButton
            />
          </Stack>
        </div>

        {/* Detail Modal */}
        <TicketDetailModal 
            open={!!selectedTicket}
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onCancel={handleCancelTicket}
        />
    </div>
  );
}
