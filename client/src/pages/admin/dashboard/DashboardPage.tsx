import { 
    PeopleOutline, 
    ConfirmationNumberOutlined, 
    CreditCardOutlined, 
    DirectionsBusOutlined 
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useEffect } from 'react';
import { fetchUsers } from '../../../slices/userSlice';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => {
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon className={color} />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{value}</div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const getStyle = (s: string) => {
        switch (s.toUpperCase()) {
            case 'CANCELLED':
            case 'FAILED':
                return 'bg-red-100 text-red-600';
            case 'BOOKED':
            case 'COMPLETED':
                return 'bg-green-100 text-green-600';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStyle(status)}`}>
            {status}
        </span>
    );
};

const DashboardPage = () => {
    // Mock Data
    const bookings = [
        { id: '#1', name: 'Nguyễn Văn A', time: '02:06:48 14/12/2025', price: '200.000 đ', status: 'CANCELLED' },
        { id: '#2', name: 'Trần Thị B', time: '21:35:41 14/12/2025', price: '250.000 đ', status: 'BOOKED' },
        { id: '#3', name: 'Lê Văn C', time: '20:39:32 16/12/2025', price: '300.000 đ', status: 'BOOKED' },
        { id: '#4', name: 'Phạm Thị D', time: '22:07:40 30/11/2025', price: '350.000 đ', status: 'BOOKED' },
        { id: '#5', name: 'Hoàng Minh E', time: '03:24:38 8/12/2025', price: '400.000 đ', status: 'BOOKED' },
        { id: '#6', name: 'Nguyễn Văn A', time: '13:03:26 7/12/2025', price: '450.000 đ', status: 'BOOKED' },
    ];

    const transactions = [
        { id: 'TXN00000001', time: '19:13:08 16/12/2025', price: '200.000 đ', status: 'COMPLETED' },
        { id: 'TXN00000002', time: '11:54:04 6/12/2025', price: '250.000 đ', status: 'PENDING' },
        { id: 'TXN00000003', time: '20:42:21 19/12/2025', price: '300.000 đ', status: 'FAILED' },
        { id: 'TXN00000004', time: '19:15:37 18/12/2025', price: '350.000 đ', status: 'COMPLETED' },
        { id: 'TXN00000005', time: '19:01:13 19/12/2025', price: '400.000 đ', status: 'PENDING' },
        { id: 'TXN00000006', time: '09:52:13 6/12/2025', price: '450.000 đ', status: 'FAILED' },
    ];

    const { users } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
                <p className="text-slate-500 mt-1 text-sm">Dashboard quản trị</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Người dùng" 
                    value={users.length+''}
                    icon={PeopleOutline} 
                    color="text-blue-600" 
                />
                <StatCard 
                    title="Vé đã bán" 
                    value="91" 
                    icon={ConfirmationNumberOutlined} 
                    color="text-green-600" 
                />
                <StatCard 
                    title="Doanh thu" 
                    value="₫14.4M" 
                    icon={CreditCardOutlined} 
                    color="text-slate-800" 
                />
                <StatCard 
                    title="Nhà xe" 
                    value="3" 
                    icon={DirectionsBusOutlined} 
                    color="text-purple-600" 
                />
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="font-bold text-lg mb-4 text-slate-800">Vé đặt gần đây</h2>
                    <div className="space-y-4">
                        {bookings.map((item, index) => (
                            <div key={index} className="flex justify-between items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-slate-800 text-sm">{item.id} - {item.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{item.time}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800 text-sm mb-1">{item.price}</div>
                                    <StatusBadge status={item.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="font-bold text-lg mb-4 text-slate-800">Thanh toán gần đây</h2>
                    <div className="space-y-4">
                        {transactions.map((item, index) => (
                            <div key={index} className="flex justify-between items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-slate-800 text-sm">{item.id}</div>
                                    <div className="text-xs text-slate-400 mt-1">{item.time}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800 text-sm mb-1">{item.price}</div>
                                    <StatusBadge status={item.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
