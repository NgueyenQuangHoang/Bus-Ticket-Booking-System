import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VehicleType } from "../../../../../services/vehicleTypeService";
import { Pagination } from "@mui/material";

type Props = {
  data: VehicleType[];
  onEdit: (item: VehicleType) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

export default function VehicleTypeTable({
  data,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Mã</th>
              <th className="px-6 py-4">Tên hiển thị</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-600" title={String(item.id)}>
                      #{String(item.id).slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{item.code}</td>
                  <td className="px-6 py-4">{item.display_name}</td>
                  <td className="px-6 py-4 text-gray-500">{item.description}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-500 hover:text-blue-700 transition p-1 rounded-full hover:bg-blue-50 hover:cursor-pointer"
                      title="Sửa"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id as string)}
                      className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-50 hover:cursor-pointer"
                      title="Xóa"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Không có dữ liệu
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 flex justify-end border-t border-gray-100">
           <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_event, value) => onPageChange(value)} 
                color="primary" 
                shape="rounded"
            />
        </div>
      )}
    </div>
  );
}
