import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar/Sidebar';
import AdminHeader from '../components/admin/Header/AdminHeader';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
