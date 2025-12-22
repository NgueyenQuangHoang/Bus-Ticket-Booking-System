const SortBar = () => {
    return (
            <div className="w-full flex md:items-center md:justify-center justify-between gap-2">
                {/* Label cố định bên trái */}
                <div className="md:block hidden px-3 py-2 border-blue-400 text-blue-500 text-sm font-medium bg-white whitespace-nowrap">
                    Sắp xếp theo tuyến đường
                </div>
                <button className="font-bold md:hidden">
                    Bộ lọc
                </button>
                {/* Select Giờ đi */}
               <div className="flex gap-3">
                    <div className="relative border border-gray-500 rounded">
                        <select
                            className="appearance-none bg-transparent pl-4 pr-8 py-2 text-sm text-gray-700 cursor-pointer focus:outline-none hover:bg-gray-50 transition-colors"
                            defaultValue=""
                        >
                            <option value="" disabled hidden>Giờ đi</option>
                            <option value="som-nhat">Sớm nhất</option>
                            <option value="muon-nhat">Muộn nhất</option>
                        </select>
                        {/* Icon mũi tên giả lập (vì dùng appearance-none) */}
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
        
                    {/* Select Mức giá */}
                    <div className="relative border border-gray-500 rounded">
                        <select
                            className="appearance-none bg-transparent pl-4 pr-8 py-2 text-sm text-gray-700 cursor-pointer focus:outline-none hover:bg-gray-50 transition-colors"
                            defaultValue=""
                        >
                            <option value="" disabled hidden>Mức giá</option>
                            <option value="thap-den-cao">Giá thấp đến cao</option>
                            <option value="cao-den-thap">Giá cao đến thấp</option>
                        </select>
                        {/* Icon mũi tên giả lập */}
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <span className="text-[10px]">▼</span>
                        </div>
                    </div>
               </div>
            </div>
    );
};

export default SortBar;