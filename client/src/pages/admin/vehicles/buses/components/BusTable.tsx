import type { Bus } from "../../../../../types";
import BusAction from "./BusAction";

type BusTableItem = Bus & {
  company_name?: string;
  bus_type?: string;
  seat_layout?: string;
  status?: string;
};

type Props = {
  data: BusTableItem[];
  onEdit?: (item: BusTableItem) => void;
  onDelete?: (item: BusTableItem) => void;
};

export default function BusTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* ================= TABLE (>= 391px) ================= */}
      <div className="hidden [@media(min-width:391px)]:block border border-gray-200 rounded-b-xl bg-white">
        {/* HEADER */}
        <div
          className="
            grid grid-cols-[100px_2fr_2fr_2fr_1.5fr_2fr_1fr_1fr_100px]
            bg-gray-50
            text-sm text-gray-500
            border-b border-gray-200
          "
        >
          <div className="p-3 text-center font-mono">ID</div>
          <div className="p-3">Tên xe</div>
          <div className="p-3">Biển số</div>
          <div className="p-3">Nhà xe</div>
          <div className="p-3">Loại xe</div>
          <div className="p-3">Layout ghế</div>
          <div className="p-3">Số ghế</div>
          <div className="p-3 text-center">Trạng thái</div>
          <div className="p-3 text-center">Thao tác</div>
        </div>

        {data.map((bus) => (
          <div
            key={bus.id || bus.bus_id}
            className="
              grid grid-cols-[100px_2fr_2fr_2fr_1.5fr_2fr_1fr_1fr_100px]
              items-center
              border-t border-gray-200
              text-sm text-gray-700
              hover:bg-gray-50
            "
          >
            {/* ID */}
            <div className="p-3 text-center font-mono" title={String(bus.id || bus.bus_id)}>
              {(() => {
                  const id = String(bus.id || bus.bus_id);
                  return id.length > 8 ? id.substring(0, 8) + '...' : id;
              })()}
            </div>

            <div className="p-3 font-medium">{bus.name}</div>
            <div className="p-3">{bus.license_plate}</div>
            <div className="p-3">{bus.company_name ?? "—"}</div>
            <div className="p-3">{bus.bus_type ?? "—"}</div>
            <div className="p-3">{bus.seat_layout ?? "—"}</div>
            <div className="p-3">{bus.capacity ?? "—"}</div>

            {/* STATUS */}
            <div className="p-3 flex justify-center">
              <span
                className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${
                    bus.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : bus.status === "MAINTENANCE"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {bus.status ?? "—"}
              </span>
            </div>

            {/* ACTION */}
            <div className="p-3 flex justify-center items-center">
              <BusAction
                item={bus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE (< 391px) ================= */}
      <div className="space-y-4 [@media(min-width:391px)]:hidden">
        {data.map((bus) => (
          <div
            key={bus.id || bus.bus_id}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">{bus.name}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {bus.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Biển số: {bus.license_plate}
            </p>

            <p className="text-sm text-gray-600">
              Nhà xe: {bus.company_name}
            </p>

            <p className="text-sm text-gray-600">
              {bus.bus_type} · {bus.seat_layout}
            </p>

            <p className="text-sm text-gray-600">
              Số ghế: {bus.capacity}
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
