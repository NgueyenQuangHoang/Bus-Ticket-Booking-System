import { useEffect, useState } from "react";

import TicketHeader from "./components/TicketHeader";
import TicketSearch from "./components/TicketSearch";
import TicketTable from "./components/TicketTable";
import TicketDetailModal from "./components/TicketDetailModal";
import Swal from "sweetalert2";
import busService from "../../../services/admin/busService";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchBusCompanies } from "../../../slices/busCompanySlice";
import type { Bus } from "../../../types";
import { ticketService, type TicketUI } from "../../../services/ticketService";
import { Pagination, Stack } from "@mui/material";
import { getStoredBusCompanyId, getStoredRole } from "../../../utils/authStorage";

// --- MOCK DATA ---
// const CUSTOMERS = [
//     "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Minh F",
//     "Đỗ Văn G", "Ngô Thị H", "Bùi Văn I", "Vũ Thị K", "Đinh Văn L"
// ];

// const generateMockData = (count: number): TicketUI[] => {
//   return Array.from({ length: count }, (_, i) => ({
//     ticket_id: i + 1,
//     ticket_code: `XC${String(i + 7000).padStart(5, '0')}`, // NEW: Display Code
//     id: String(i + 7000), 
//     user_id: 100 + i,
//     schedule_id: (i % 20) + 1,
//     seat_id: i + 1,
//     seat_type: (i % 3 === 0) ? "Giường đôi" : (i % 3 === 1) ? "Giường đơn" : "Ghế ngồi",
//     price: 200000 + (i % 5) * 50000,
//     status: (i % 10 === 0) ? "USED" : (i % 7 === 0) ? "CANCELLED" : "BOOKED", // Added USED
//     payment_status: (i % 7 === 0) ? "REFUNDED" : (i % 5 === 0) ? "PENDING" : "PAID", // Added Payment Status
//     created_at: `${(i % 28) + 1}/12/2025`,
//     updated_at: "2025-01-10",
    
//     // UI Helpers (Enrichment)
//     customer_name: CUSTOMERS[i % CUSTOMERS.length],
//     trip_name: `${(i % 20) + 1}`,
//   }));
// };

// const INITIAL_DATA = generateMockData(100);

export default function TicketsPage() {

  const [page, setPage] = useState(1)
  const {companies} = useAppSelector(state => state.busCompany)
  const dispatch = useAppDispatch()  
  const role = getStoredRole();
  const busCompanyId = getStoredBusCompanyId();
  useEffect(() => {
    if (role !== "BUS_COMPANY") {
      dispatch(fetchBusCompanies())
    }
  }, [dispatch, role])

  const [buses, setBuses] = useState<Bus[]>([])
  const [tickets, setTickets] = useState<TicketUI[]>([])
  
  useEffect(() => {
    const loadData = async () => {
      const allBuses = await busService.getAllBuses();
      const scopedBuses = role === "BUS_COMPANY" && busCompanyId
        ? (allBuses || []).filter(b => String(b.bus_company_id ?? b.company_id) === String(busCompanyId))
        : (allBuses || []);
      setBuses(scopedBuses);

      const allowedBusIds = scopedBuses.map(b => String(b.id ?? b.bus_id)).filter(Boolean) as string[];
      const ticketData = await ticketService.getAllTickets(role === "BUS_COMPANY" ? allowedBusIds : []);
      setTickets(ticketData);
    };
    loadData();
  }, [role, busCompanyId])

  const [idBus, setIdBus] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<TicketUI | null>(null);


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
            t.id === selectedTicket.id 
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

  const filteredData : TicketUI[] = idBus ? tickets.filter(item => String(item.busInfo.id) === String(idBus)) : (role === "BUS_COMPANY" ? tickets : [])
  const paginatedData : TicketUI[] = filteredData.slice((page-1) * 10, page * 10)

  return (
    <div className="space-y-6">
      <TicketHeader 
        totalCount={filteredData.length} 
        onExportClick={() => alert("Chức năng xuất báo cáo đang phát triển")}
      />

      <TicketSearch 
        value={idBus}
        onChange={(val) => { setIdBus(val) }}
        bus={buses}
        companies={role === "BUS_COMPANY" && busCompanyId ? companies.filter(c => String(c.id) === String(busCompanyId)) : companies}
        isBusCompany={role === "BUS_COMPANY"}
        busCompanyId={busCompanyId || undefined}
      />

      <TicketTable
        data={paginatedData}
        onView={(item) => setSelectedTicket(item)}
      />

       {/* Pagination */}
       <div className="flex justify-end pt-4">
          <Stack spacing={2}>
            <Pagination 
              count={Math.ceil((filteredData.length) / 10)} 
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
