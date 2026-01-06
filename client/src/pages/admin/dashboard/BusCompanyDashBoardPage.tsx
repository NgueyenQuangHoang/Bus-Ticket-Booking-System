import React, { useEffect, useMemo, useState } from "react";
import { Bus, Ticket, Wallet, TrendingUp, Calendar, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import busService from "../../../services/admin/busService";
import { scheduleService } from "../../../services/scheduleService";
import { busCompanyService } from "../../../services/busCompanyService";
import { getStoredBusCompanyId, getStoredRole } from "../../../utils/authStorage";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

type ScheduleUI = Awaited<ReturnType<typeof scheduleService.getAllSchedules>>[number];

const fmtNumber = (n: number) => n.toLocaleString("vi-VN");

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  </div>
);

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const BusCompanyDashboard: React.FC = () => {
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string>("Nhà xe của bạn");
  const [busesCount, setBusesCount] = useState(0);
  const [schedules, setSchedules] = useState<ScheduleUI[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!busCompanyId) return;
      setLoading(true);
      try {
        const [buses, allSchedules, companies] = await Promise.all([
          busService.getAllBuses(),
          scheduleService.getAllSchedules(),
          busCompanyService.getAllBusCompanies(),
        ]);

        const company = companies.find(
          (c) => String(c.id) === String(busCompanyId) || String(c.bus_company_id) === String(busCompanyId)
        );
        if (company?.company_name) setCompanyName(company.company_name);

        const scopedBuses = (buses || []).filter((b) => {
          const cid = b.bus_company_id ?? b.company_id;
          return cid && String(cid) === String(busCompanyId);
        });
        setBusesCount(scopedBuses.length);

        const scopedBusIds = new Set(scopedBuses.map((b) => String(b.id || b.bus_id)));
        const scopedSchedules = (allSchedules || []).filter((s) => scopedBusIds.has(String(s.bus_id)));
        setSchedules(scopedSchedules);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (isBusCompany && busCompanyId) {
      fetchData();
    }
  }, [isBusCompany, busCompanyId]);

  const getBookedSeats = (schedule: ScheduleUI) =>
    (schedule.seat_schedules || []).filter((ss) => ss.status === "BOOKED" || ss.status === "COMPLETED");

  const today = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const tripsToday = schedules.filter((s) => {
      const dep = new Date(s.departure_time);
      return dep >= start && dep < end;
    });

    const upcoming = tripsToday.filter((s) => new Date(s.departure_time) > now).length;
    const ticketsSoldToday = tripsToday.reduce((sum, s) => sum + getBookedSeats(s).length, 0);

    return {
      trips: tripsToday.length,
      upcomingTrips: upcoming,
      ticketsSold: ticketsSoldToday,
    };
  }, [schedules]);

  const kpi = useMemo(() => {
    const totalTrips = schedules.length;
    const ticketsSold = schedules.reduce((sum, s) => sum + getBookedSeats(s).length, 0);
    // occupancy = busy / capacity
    const capacity = schedules.reduce((sum, s) => sum + (s.total_seats || 0), 0);
    const occupancyRate = capacity > 0 ? Math.round((ticketsSold / capacity) * 100) : 0;

    // Revenue: sum booked/completed seat prices; fallback to schedule price/base_price if seat lacks price
    const revenue = schedules.reduce((sum, s) => {
      const bookedSeats = getBookedSeats(s);
      return (
        sum +
        bookedSeats.reduce((seatSum, seat) => seatSum + (seat.price || s.price || s.base_price || 0), 0)
      );
    }, 0);

    return { totalTrips, ticketsSold, revenue, occupancyRate };
  }, [schedules]);

  const chartData = useMemo(() => {
    // group by date
    const map = new Map<string, { date: string; trips: number; tickets: number }>();
    schedules.forEach((s) => {
      const d = new Date(s.departure_time);
      const key = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
      const current = map.get(key) || { date: key, trips: 0, tickets: 0 };
      current.trips += 1;
      current.tickets += getBookedSeats(s).length;
      map.set(key, current);
    });
    return Array.from(map.values()).sort((a, b) => {
      const [da, ma] = a.date.split("/").map(Number);
      const [db, mb] = b.date.split("/").map(Number);
      return ma === mb ? da - db : ma - mb;
    });
  }, [schedules]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard – {companyName}
          </h1>
          <p className="text-gray-600">Tổng quan hoạt động của nhà xe</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Bus className="w-6 h-6 text-white" />}
                label="Số xe"
                value={busesCount}
                subtext="Đang quản lý"
                color="bg-blue-500"
              />

              <StatCard
                icon={<Ticket className="w-6 h-6 text-white" />}
                label="Vé đã đặt"
                value={fmtNumber(kpi.ticketsSold)}
                subtext="Tổng số vé trên các chuyến"
                color="bg-green-500"
              />

              <StatCard
                icon={<Wallet className="w-6 h-6 text-white" />}
                label="Doanh thu ước tính"
                value={`${fmtNumber(kpi.revenue)}đ`}
                subtext="Giá * vé đã đặt"
                color="bg-orange-500"
              />

              <StatCard
                icon={<TrendingUp className="w-6 h-6 text-white" />}
                label="Tỷ lệ lấp đầy"
                value={`${kpi.occupancyRate}%`}
                subtext="Tổng vé / tổng ghế"
                color="bg-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Chuyến & vé theo ngày</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} name="Số chuyến" />
                      <Line yAxisId="right" type="monotone" dataKey="tickets" stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} name="Vé đã đặt" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Thống kê hôm nay</h2>
                  </div>

                  <div className="space-y-1">
                    <SummaryItem label="Chuyến hôm nay" value={today.trips} />
                    <SummaryItem label="Vé bán hôm nay" value={fmtNumber(today.ticketsSold)} />
                    <SummaryItem label="Chuyến sắp khởi hành" value={`${today.upcomingTrips} chuyến`} />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Tổng chuyến đã lên lịch</p>
                        <p className="text-xs text-blue-700 mt-1">{kpi.totalTrips} chuyến của nhà xe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusCompanyDashboard;
