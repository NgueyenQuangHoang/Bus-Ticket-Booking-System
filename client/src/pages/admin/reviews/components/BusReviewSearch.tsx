interface Props {
  total: number;
  onSearch: (value: string) => void;
}

export default function BusReviewSearch({ total, onSearch }: Props) {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white">
      <div className="order-2 md:order-1 relative w-full max-w-sm">
        <input
            placeholder="Tìm kiếm đánh giá..."
            className="w-full border border-gray-200 pl-10 pr-3 py-2.5 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1295DB] focus:border-transparent transition-all"
            onChange={(e) => onSearch(e.target.value)}
        />
        <svg 
            className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="order-1 md:order-2 flex items-center justify-between w-full md:w-auto">
         <span className="text-sm text-gray-500 font-medium">
            Tổng số đánh giá
         </span>
         <span className="ml-2 px-3 py-1 bg-blue-50 text-[#1295DB] font-bold rounded-lg text-sm border border-blue-100">
            {total}
         </span>
      </div>
    </div>
  );
}
