import type { BusCompany } from "../../../../../types/bus";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusCompanyAction from "./BusCompanyAction";


type Props = {
  data: BusCompany[];
  onEdit?: (item: BusCompany) => void;
  onDelete?: (item: BusCompany) => void;
};

export default function BusCompanyTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden sm:block border border-t-0 border-gray-200 rounded-b-xl">
        <div className="bg-white overflow-hidden rounded-b-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 text-xs font-medium">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Tên nhà xe</th>
                <th className="px-4 py-3 text-left">Điện thoại</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3" title={String(item.id)}>
                    {(() => {
                        const id = String(item.id);
                        return id.length > 8 ? id.substring(0, 8) + '. . .' : id;
                    })()}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {item.company_name}
                  </td>

                  <td className="px-4 py-3">
                    {item.contact_phone}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`
                        inline-block text-xs font-semibold px-3 py-1 rounded-full
                        ${
                          item.status === "ACTIVE"
                            ? "bg-green-100 text-green-600"
                            : item.status === "INACTIVE"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-600"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <BusCompanyAction 
  item={item}
  onEdit={onEdit}
  onDelete={onDelete}
/>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MOBILE CARD ===== */}
      <div className="space-y-4 sm:hidden mt-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {item.company_name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.contact_phone}
                </p>
                <p className="text-xs text-gray-400">
                  {item.address}
                </p>
              </div>

              <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                {item.status}
              </span>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <EditIcon
                onClick={() => onEdit?.(item)}
                className="text-green-500 cursor-pointer"
                sx={{ fontSize: 20 }}
              />
              <DeleteIcon
                onClick={() => onDelete?.(item)}
                className="text-red-500 cursor-pointer"
                sx={{ fontSize: 20 }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
