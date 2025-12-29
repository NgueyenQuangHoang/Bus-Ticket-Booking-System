import type { Bus } from "../../../../../types";

type Props = {
  value: string | number;
  onChange: (busId: string) => void;
  buses: Bus[];
};

export default function BusSelect({ value, onChange, buses }: Props) {
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
        <option value="">-- Chọn xe --</option>
        {buses.map((bus) => (
            <option key={bus.id || bus.bus_id} value={bus.id || bus.bus_id}>
                {bus.name} - {bus.license_plate}
            </option>
        ))}
      </select>
    </div>
  );
}
