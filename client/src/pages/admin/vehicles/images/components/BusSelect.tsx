type Props = {
  value: string;
  onChange: (bus: string) => void;
};

export default function BusSelect({ value, onChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <label className="block text-sm font-medium mb-2">
        Chọn xe:
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option>FUTA-VIP01 - 51B-12345</option>
        <option>FUTA-VIP02 - 51B-12346</option>
      </select>
    </div>
  );
}
