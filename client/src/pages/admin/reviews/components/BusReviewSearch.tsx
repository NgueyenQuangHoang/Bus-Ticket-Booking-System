interface Props {
  total: number;
}

export default function BusReviewSearch({ total }: Props) {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <input
        placeholder="Tìm kiếm..."
        className="w-full max-w-sm border border-gray-300 px-3 py-2 rounded text-sm"
      />
      <span className="hidden sm:block text-sm text-gray-500">
        Tổng: <b>{total}</b>
      </span>
    </div>
  );
}
