import React from "react";
import {
  Bus,
  Ticket,
  Wallet,
  TrendingUp,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ============================================
// TYPE DEFINITIONS
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
const mockData = {
  companyName: "Nhà xe Minh Quốc",
  stats: {
    totalTrips: 156,
    ticketsSold: 3847,
    revenue: "320.500.000",
    occupancyRate: 78,
  },
  today: {
    trips: 12,
    ticketsSold: 287,
    revenue: "42.800.000",
    upcomingTrips: 5,
  },
  revenueChart: [
    { date: "01/01", revenue: 28500000, trips: 18 },
    { date: "02/01", revenue: 32200000, trips: 21 },
    { date: "03/01", revenue: 29800000, trips: 19 },
    { date: "04/01", revenue: 35600000, trips: 23 },
    { date: "05/01", revenue: 31200000, trips: 20 },
    { date: "06/01", revenue: 38900000, trips: 25 },
    { date: "07/01", revenue: 42100000, trips: 27 },
    { date: "08/01", revenue: 36500000, trips: 24 },
    { date: "09/01", revenue: 39800000, trips: 26 },
    { date: "10/01", revenue: 43200000, trips: 28 },
    { date: "11/01", revenue: 40500000, trips: 26 },
    { date: "12/01", revenue: 45800000, trips: 29 },
    { date: "13/01", revenue: 41200000, trips: 27 },
    { date: "14/01", revenue: 38600000, trips: 25 },
  ],
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color,
}) => {
  return (
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
};

// ============================================
// SUMMARY ITEM COMPONENT
// ============================================
const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const BusCompanyDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================
            HEADER SECTION
        ============================================ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard – {mockData.companyName}
          </h1>
          <p className="text-gray-600">
            Tổng quan hoạt động kinh doanh của nhà xe
          </p>
        </div>

        {/* ============================================
            KPI CARDS SECTION (4 CARDS)
        ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Bus className="w-6 h-6 text-white" />}
            label="Tổng chuyến"
            value={mockData.stats.totalTrips}
            subtext="Trong tháng này"
            color="bg-blue-500"
          />

          <StatCard
            icon={<Ticket className="w-6 h-6 text-white" />}
            label="Vé đã bán"
            value={mockData.stats.ticketsSold.toLocaleString()}
            subtext="Tất cả chuyến"
            color="bg-green-500"
          />

          <StatCard
            icon={<Wallet className="w-6 h-6 text-white" />}
            label="Doanh thu"
            value={`${mockData.stats.revenue}đ`}
            subtext="Tháng hiện tại"
            color="bg-orange-500"
          />

          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            label="Tỷ lệ lấp đầy"
            value={`${mockData.stats.occupancyRate}%`}
            subtext="Trung bình"
            color="bg-purple-500"
          />
        </div>

        {/* ============================================
            DETAILED STATISTICS SECTION
        ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Revenue Chart (70% width = col-span-2) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Doanh thu theo ngày
              </h2>

              {/* Real Chart using Recharts */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()}đ`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Doanh thu (VNĐ)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT: Today's Quick Stats (30% width = col-span-1) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Thống kê nhanh hôm nay
                </h2>
              </div>

              <div className="space-y-1">
                <SummaryItem
                  label="Chuyến hôm nay"
                  value={mockData.today.trips}
                />
                <SummaryItem
                  label="Vé bán hôm nay"
                  value={mockData.today.ticketsSold.toLocaleString()}
                />
                <SummaryItem
                  label="Doanh thu hôm nay"
                  value={`${mockData.today.revenue}đ`}
                />
                <SummaryItem
                  label="Chuyến sắp khởi hành"
                  value={`${mockData.today.upcomingTrips} chuyến`}
                />
              </div>

              {/* Additional Info Card */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Chuyến gần nhất
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Hà Nội - Hải Phòng • 14:30
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCompanyDashboard;
