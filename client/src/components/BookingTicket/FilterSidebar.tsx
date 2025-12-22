import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Search, RotateCcw, Clock, Tag, Bus } from 'lucide-react';

// Định nghĩa Interface cho các khoảng Range (Giá, Thời gian)
interface RangeValue {
    min: number;
    max: number;
}

// Định nghĩa Interface cho trạng thái Filters
interface FiltersState {
    popular: string[];
    price: RangeValue;
    time: RangeValue;
    busCompanySearch: string;
    selectedCompanies: string[];
}

const FilterSidebar: React.FC = () => {
    // Khởi tạo trạng thái mặc định với kiểu dữ liệu FiltersState
    const initialFilters: FiltersState = {
        popular: [],
        price: { min: 0, max: 2000000 },
        time: { min: 0, max: 24 },
        busCompanySearch: '',
        selectedCompanies: []
    };

    const [filters, setFilters] = useState<FiltersState>(initialFilters);

    const busCompanies: string[] = [
        "Anh Huy (Hải Phòng)",
        "Anh Huy Đất Cảng",
        "Anh Huy Travel",
        "Bằng Phấn",
        "Cát Bà Express",
        "Cát Bà Go Easy Limousine",
        "Hải Âu",
        "Hoàng Long"
    ];

    // Theo dõi và log kết quả mỗi khi filters thay đổi
    useEffect(() => {
        const logData = {
            thoi_gian: `${filters.time.min}:00 đến ${filters.time.max}:00`,
            gia_ve: `${filters.price.min.toLocaleString('vi-VN')}đ - ${filters.price.max.toLocaleString('vi-VN')}đ`,
            nha_xe_da_chon: filters.selectedCompanies,
            tieu_chi_pho_bien: filters.popular,
            tu_khoa_tim_kiem: filters.busCompanySearch
        };
        console.log("Dữ liệu lọc hiện tại (TS):", logData);
    }, [filters]);

    const handleReset = (): void => {
        setFilters(initialFilters);
    };

    /**
     * Xử lý thay đổi thanh trượt 2 đầu
     * @param type Loại bộ lọc ('time' hoặc 'price')
     * @param key Cực hạn ('min' hoặc 'max')
     * @param value Giá trị mới từ input
     */
    const handleRangeChange = (type: 'time' | 'price', key: 'min' | 'max', value: string): void => {
        const val = parseInt(value, 10);
        setFilters(prev => {
            const newRange = { ...prev[type] };

            if (key === 'min') {
                newRange.min = Math.min(val, prev[type].max - 1);
            } else {
                newRange.max = Math.max(val, prev[type].min + 1);
            }

            return { ...prev, [type]: newRange };
        });
    };

    const toggleCompany = (company: string): void => {
        setFilters(prev => {
            const isSelected = prev.selectedCompanies.includes(company);
            return {
                ...prev,
                selectedCompanies: isSelected
                    ? prev.selectedCompanies.filter(c => c !== company)
                    : [...prev.selectedCompanies, company]
            };
        });
    };

    const togglePopular = (item: string): void => {
        setFilters(prev => {
            const isSelected = prev.popular.includes(item);
            return {
                ...prev,
                popular: isSelected
                    ? prev.popular.filter(i => i !== item)
                    : [...prev.popular, item]
            };
        });
    };

    const getTrackProgress = (min: number, max: number, limit: number) => {
        return {
            left: `${(min / limit) * 100}%`,
            right: `${100 - (max / limit) * 100}%`
        };
    };

    return (
        <div className="flex justify-center bg-slate-50 font-sans ">
            <div className="w-full max-w-sm bg-white p-6 shadow-xl border border-slate-200 rounded-3xl h-fit sticky top-6 ">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-extrabold text-slate-800">Bộ lọc</h2>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <RotateCcw size={16} />
                        Đặt lại
                    </button>
                </div>

                {/* Phần: Tiêu chí phổ biến */}
                <section className="mb-10">
                    <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-5 text-xs uppercase tracking-widest">
                        <Tag size={14} className="text-blue-500" />
                        Tiêu chí phổ biến
                    </h3>
                    <div className="space-y-4">
                        {['Chuyến giảm giá', 'Xe VIP Limousine'].map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.popular.includes(item)}
                                    onChange={() => togglePopular(item)}
                                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                />
                                <span className={`text-sm transition-colors ${filters.popular.includes(item) ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Phần: Giờ đi */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest">
                            <Clock size={14} className="text-blue-500" />
                            Giờ đi
                        </h3>
                        <span className="text-[11px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                            {filters.time.min}:00 - {filters.time.max}:00
                        </span>
                    </div>

                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full mb-4">
                        <div
                            className="absolute h-full bg-blue-500 rounded-full"
                            style={getTrackProgress(filters.time.min, filters.time.max, 24)}
                        />
                        <input
                            type="range"
                            min="0"
                            max="24"
                            value={filters.time.min}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRangeChange('time', 'min', e.target.value)}
                            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 custom-range-slider"
                        />
                        <input
                            type="range"
                            min="0"
                            max="24"
                            value={filters.time.max}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRangeChange('time', 'max', e.target.value)}
                            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 custom-range-slider"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>24:00</span>
                    </div>
                </section>

                {/* Phần: Giá vé */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-900 font-bold text-xs uppercase tracking-widest">Giá vé</h3>
                        <span className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                            Dưới {(filters.price.max / 1000).toLocaleString()}K
                        </span>
                    </div>

                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full mb-4">
                        <div
                            className="absolute h-full bg-emerald-500 rounded-full"
                            style={getTrackProgress(filters.price.min, filters.price.max, 2000000)}
                        />
                        <input
                            type="range"
                            min="0"
                            max="2000000"
                            step="50000"
                            value={filters.price.min}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRangeChange('price', 'min', e.target.value)}
                            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 custom-range-slider emerald-thumb"
                        />
                        <input
                            type="range"
                            min="0"
                            max="2000000"
                            step="50000"
                            value={filters.price.max}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleRangeChange('price', 'max', e.target.value)}
                            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none z-20 custom-range-slider emerald-thumb"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>0đ</span>
                        <span>2.000.000đ</span>
                    </div>
                </section>

                {/* Phần: Nhà xe */}
                <section className="mb-2">
                    <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-5 text-xs uppercase tracking-widest">
                        <Bus size={14} className="text-blue-500" />
                        Nhà xe
                    </h3>
                    <div className="relative mb-5 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm tên nhà xe..."
                            value={filters.busCompanySearch}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters(p => ({ ...p, busCompanySearch: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all"
                        />
                    </div>
                    <div className="space-y-1 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                        {busCompanies
                            .filter(c => c.toLowerCase().includes(filters.busCompanySearch.toLowerCase()))
                            .map((company) => (
                                <label
                                    key={company}
                                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${filters.selectedCompanies.includes(company) ? 'bg-blue-50' : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedCompanies.includes(company)}
                                        onChange={() => toggleCompany(company)}
                                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className={`text-sm ${filters.selectedCompanies.includes(company) ? 'text-blue-700 font-bold' : 'text-slate-600'
                                        }`}>
                                        {company}
                                    </span>
                                </label>
                            ))}
                    </div>
                </section>

                <style dangerouslySetInnerHTML={{
                    __html: `
            .custom-range-slider::-webkit-slider-thumb {
              appearance: none;
              pointer-events: auto;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: white;
              border: 3px solid #3b82f6;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              z-index: 30;
              position: relative;
            }
            .emerald-thumb::-webkit-slider-thumb { border-color: #10b981; }
            
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          `
                }} />
            </div>
        </div>
    );
};

export default FilterSidebar;