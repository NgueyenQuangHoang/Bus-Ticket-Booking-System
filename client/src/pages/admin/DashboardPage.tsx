const DashboardPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm">Total Bookings</div>
          <div className="text-3xl font-bold">1,234</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm">Total Revenue</div>
          <div className="text-3xl font-bold">$45,678</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm">Active Users</div>
          <div className="text-3xl font-bold">890</div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
