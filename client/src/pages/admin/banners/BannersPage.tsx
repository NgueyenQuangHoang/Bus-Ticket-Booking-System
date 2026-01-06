import React, { useEffect, useState } from 'react';
import { Pencil, Trash, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/Admin/Button';
import { Input } from '../../../components/ui/Admin/Input';
import { bannerService } from '../../../services/bannerService';
import type { Banner } from '../../../types';

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getAllBanners();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Filter banners based on search term (searching by ID or Position for now)
  const filteredBanners = banners.filter((banner) =>
    banner.position.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.target_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý banner</h1>
          <p className="text-gray-500 mt-1">{banners.length} banner</p>
        </div>
        <Button 
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-none rounded-lg px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm banner
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="w-96 relative">
          <Input 
            placeholder="Tìm kiếm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-gray-900 border-gray-200 placeholder:text-gray-400 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
            Tổng: <span className="font-medium text-gray-900">{filteredBanners.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">HÌNH ẢNH</th>
                <th className="px-6 py-4 font-medium">VỊ TRÍ</th>
                <th className="px-6 py-4 font-medium">LOẠI ĐÍCH</th>
                <th className="px-6 py-4 font-medium">BẮT ĐẦU</th>
                <th className="px-6 py-4 font-medium">KẾT THÚC</th>
                <th className="px-6 py-4 font-medium text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                   <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                     Đang tải dữ liệu...
                   </td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy banner nào.
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.banner_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {banner.banner_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
                        {banner.image_url ? (
                            <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">Banner</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {banner.position}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${banner.target_type === 'ROUTE' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                        {banner.target_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {banner.start_date ? format(new Date(banner.start_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {banner.end_date ? format(new Date(banner.end_date), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BannersPage;
