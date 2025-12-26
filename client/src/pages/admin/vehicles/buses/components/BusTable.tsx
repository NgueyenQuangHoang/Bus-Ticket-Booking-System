import type { Bus } from "../../../../../types";
import BusAction from "./BusAction";

type BusWithCompany = Bus & {
  company?: {
    company_id: number;
    company_name?: string;
  };
};

type Props = {
  data: BusWithCompany[];
  onEdit?: (item: BusWithCompany) => void;
  onDelete?: (item: BusWithCompany) => void;
};

export default function BusTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* ================= TABLE (TABLET + DESKTOP) ================= */}
      <div className="hidden [@media(min-width:391px)]:block border border-gray-200 rounded-b-xl bg-white">
        {/* HEADER */}
        <div
          className="
            grid grid-cols-[60px_2fr_2fr_2fr_1fr_100px]
            bg-gray-50
            text-sm text-gray-500
            border-b border-gray-200
          "
        >
          <div className="p-3">ID</div>
          <div className="p-3">Tên xe</div>
          <div className="p-3">Biển số</div>
          <div className="p-3">Nhà xe</div>
          <div className="p-3">Số ghế</div>
          <div className="p-3 text-center">Thao tác</div>
        </div>

        {data.map((bus) => (
          <div
            key={bus.bus_id}
            className="
              grid grid-cols-[60px_2fr_2fr_2fr_1fr_100px]
              border-t border-gray-100
              text-sm text-gray-700
              hover:bg-gray-50
            "
          >
            <div className="p-3">{bus.bus_id}</div>
            <div className="p-3 font-medium">{bus.name}</div>
            <div className="p-3">{bus.license_plate}</div>
            <div className="p-3">
              {bus.company?.company_name ?? "—"}
            </div>
            <div className="p-3">{bus.capacity ?? "—"}</div>

            <BusAction
              item={bus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="space-y-4 [@media(min-width:391px)]:hidden">
        {data.map((bus) => (
          <div
            key={bus.bus_id}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-semibold">{bus.name}</p>
              <span className="text-sm text-gray-500">
                {bus.capacity ?? "—"} ghế
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Biển số: {bus.license_plate}
            </p>

            <p className="text-sm text-gray-600">
              Nhà xe: {bus.company?.company_name ?? "—"}
            </p>

            <div className="flex justify-end">
              <BusAction
                item={bus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
