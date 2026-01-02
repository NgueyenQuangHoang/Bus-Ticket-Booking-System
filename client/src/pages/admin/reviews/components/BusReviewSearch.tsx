interface Props {
  total: number;
  onSearch: (value: string) => void;
}

export default function BusReviewSearch({ total, onSearch }: Props) {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
      <div className="relative w-full max-w-sm">
        <input
            placeholder="Tìm kiếm đánh giá..."
            className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            onChange={(e) => onSearch(e.target.value)}
        />
        <svg 
            className="w-4 h-4 text-gray-400 absolute left-3 top-3" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <span className="hidden sm:block text-sm text-gray-500 font-medium">
        Tổng: <b className="text-gray-900">{total}</b>
      </span>
    </div>
  );
}
