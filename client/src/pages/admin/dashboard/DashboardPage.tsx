import { useEffect, useState } from 'react';
import { 
    PeopleOutline, 
    ConfirmationNumberOutlined, 
    CreditCardOutlined, 
    DirectionsBusOutlined
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { adminDashboardService } from '../../../services/adminDashboardService';
import type { SystemStats, RevenueStat, CompanyPerformance } from '../../../services/adminDashboardService';

const StatCard = ({ title, value, icon: Icon, color, subtext }: { title: string, value: string, icon: SvgIconComponent, color: string, subtext?: string }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-36 relative overflow-hidden transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon className={color} />
                </div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-800">{value}</div>
                {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
            </div>
        </div>
    );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueStat[]>([]);
    const [companyData, setCompanyData] = useState<CompanyPerformance[]>([]);
    const [paymentData, setPaymentData] = useState<{name: string, value: number}[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await adminDashboardService.getOverviewStats();
                setStats(data.system);
                setRevenueData(data.revenueChartData);
                setCompanyData(data.companyPerformance);
                setPaymentData(data.paymentMethodStats);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fmtMoney = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-slate-500">Đang tải dữ liệu báo cáo...</div>;
    }

    if (!stats) return <div>Lỗi tải dữ liệu.</div>;

    const customerLoyaltyData = [
        { name: 'Khách mới (1 lần)', value: stats.newCustomers },
        { name: 'Khách trung thành (>1 lần)', value: stats.loyalCustomers },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
                <p className="text-slate-500 mt-1 text-sm">Báo cáo & Thống kê toàn sàn</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Tổng người dùng" 
                    value={stats.totalUsers.toLocaleString()}
                    subtext={`Trong đó ${stats.loyalCustomers} khách trung thành`}
                    icon={PeopleOutline} 
                    color="text-blue-600" 
                />
                <StatCard 
                    title="Vé đã bán" 
                    value={stats.totalTickets.toLocaleString()}
                    subtext={`Tỷ lệ hủy: ${stats.cancellationRate.toFixed(1)}%`}
                    icon={ConfirmationNumberOutlined} 
                    color="text-green-600" 
                />
                <StatCard 
                    title="Tổng doanh thu" 
                    value={fmtMoney(stats.totalRevenue)}
                    subtext="Doanh thu toàn sàn"
                    icon={CreditCardOutlined} 
                    color="text-amber-600" 
                />
                <StatCard 
                    title="Nhà xe đối tác" 
                    value={stats.totalCompanies.toLocaleString()}
                    subtext="Đang hoạt động"
                    icon={DirectionsBusOutlined} 
                    color="text-purple-600" 
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ doanh thu (30 ngày gần đây)</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}} width={80} />
                                <Tooltip formatter={(value) => fmtMoney(Number(value))} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#f59e0b" strokeWidth={3} dot={{r:4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Loyalty */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Phân loại khách hàng</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={customerLoyaltyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {customerLoyaltyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Phương thức thanh toán</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {paymentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Company Performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Hiệu quả kinh doanh theo Nhà xe</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Tên Nhà Xe</th>
                                <th className="px-6 py-3 text-right">Doanh thu</th>
                                <th className="px-6 py-3 text-center">Số vé bán</th>
                                <th className="px-6 py-3 text-center">Đánh giá TB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyData.sort((a,b) => b.revenue - a.revenue).map((comp) => (
                                <tr key={comp.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{comp.name}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">{fmtMoney(comp.revenue)}</td>
                                    <td className="px-6 py-4 text-center">{comp.ticketsSold}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {Number(comp.rating).toFixed(1)} ★
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {companyData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center">Chưa có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
