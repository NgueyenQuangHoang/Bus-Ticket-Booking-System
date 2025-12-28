interface TransactionFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function TransactionFilters({ currentFilter, onFilterChange }: TransactionFiltersProps) {
  const filters = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'FAILED', value: 'FAILED' },
    { label: 'REFUNDED', value: 'REFUNDED' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Lọc theo trạng thái:</h3>
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:cursor-pointer
                        ${currentFilter === filter.value 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                    `}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    </div>
  );
}
