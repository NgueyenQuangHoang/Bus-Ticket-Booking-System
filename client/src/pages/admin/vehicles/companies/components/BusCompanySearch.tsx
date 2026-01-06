

type Props = {
  value: string;
  onChange: (value: string) => void;
  total: number;
};

export default function BusCompanySearch({ value, onChange, total }: Props) {
  return (
    <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm kiếm nhà xe..."
          className="
            w-full max-w-sm
            border border-gray-200
            px-3 py-2 text-sm
            rounded-lg
            focus:outline-none focus:border-blue-500
          "
        />

        <span className="hidden sm:block text-sm text-gray-500">
          Tổng: <span className="font-semibold">{total}</span>
        </span>
      </div>
    </div>
  );
}
