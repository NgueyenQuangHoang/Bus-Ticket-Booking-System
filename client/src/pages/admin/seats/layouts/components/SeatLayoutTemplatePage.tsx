import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import seatService from "../../../../../services/admin/seatService";
import Swal from "sweetalert2";
import type { BusLayout } from "../../../../../types/seat";
import { getStoredRole, getStoredBusCompanyId } from "../../../../../utils/authStorage";

export default function SeatLayoutTemplatePage() {
  const isBusCompany = getStoredRole() === "BUS_COMPANY";
  const busCompanyId = getStoredBusCompanyId();

  const [layoutName, setLayoutName] = useState("");
  const [rows, setRows] = useState(7);
  const [cols, setCols] = useState(5);
  const [floors, setFloors] = useState<1 | 2>(1);
  const [templates, setTemplates] = useState<BusLayout[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<BusLayout | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const resetForm = () => {
    setLayoutName("");
    setRows(7);
    setCols(5);
    setFloors(1);
    setEditingTemplate(null);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await seatService.getAllTemplates();
      const filtered = !isBusCompany || !busCompanyId
        ? (data || [])
        : (data || []).filter((t) => {
            const ownerId = t.bus_company_id ?? t.company_id;
            return !ownerId || String(ownerId) === String(busCompanyId);
          });
      setTemplates(filtered);
    };
    fetchTemplates();
  }, [refreshKey, isBusCompany, busCompanyId]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleSave = async () => {
    if (!layoutName) {
      alert("Vui lòng nhập tên sơ đồ");
      return;
    }

    const baseData = {
      layout_name: layoutName,
      total_rows: rows,
      total_columns: cols,
      floor_count: floors,
      ...(isBusCompany && busCompanyId ? { bus_company_id: busCompanyId } : {})
    };

    if (editingTemplate?.id) {
      const result = await seatService.updateTemplate(editingTemplate.id, baseData);
      if (result) {
        alert("Đã cập nhật sơ đồ mẫu thành công!");
        triggerRefresh();
        resetForm();
      } else {
        alert("Lỗi khi cập nhật sơ đồ mẫu");
      }
      return;
    }

    const templateData = {
      ...baseData,
      created_at: new Date().toISOString(),
    };

    const result = await seatService.createTemplate(templateData);
    if (result) {
      alert("Đã lưu sơ đồ mẫu thành công!");
      triggerRefresh();
      resetForm();
    } else {
      alert("Lỗi khi lưu sơ đồ mẫu");
    }
  };

  const handleEdit = (template: BusLayout) => {
    setEditingTemplate(template);
    setLayoutName(template.layout_name || "");
    setRows(template.total_rows || 7);
    setCols(template.total_columns || 5);
    setFloors((template.floor_count as 1 | 2) || 1);
  };

  const isOwnedByCurrentCompany = (template: BusLayout) => {
    if (!busCompanyId) return false;
    const ownerId = template.bus_company_id ?? template.company_id;
    return ownerId !== undefined && ownerId !== null && String(ownerId) === String(busCompanyId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Sơ đồ ghế mẫu</h1>
        <p className="text-sm text-gray-500">
          Tạo layout ghế dùng chung cho nhiều xe
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT: FORM */}
        <div className="col-span-4 bg-white rounded-xl p-4 space-y-4 border">
          <h2 className="font-semibold">Thông tin sơ đồ</h2>

          <div>
            <label className="text-sm">Tên sơ đồ</label>
            <input
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Giường nằm 34 chỗ"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Số hàng</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(+e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm">Số cột</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(+e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Số tầng</label>
            <select
              value={floors}
              onChange={(e) => setFloors(+e.target.value as 1 | 2)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value={1}>1 tầng</option>
              <option value={2}>2 tầng</option>
            </select>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingTemplate ? "Cập nhật sơ đồ mẫu" : "Lưu sơ đồ mẫu"}
          </button>

          {editingTemplate && (
            <button
              onClick={resetForm}
              className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="col-span-8 bg-white rounded-xl p-4 border">
          <h2 className="font-semibold mb-4">Xem trước sơ đồ</h2>

          <div className="flex gap-6 justify-center">
            {Array.from({ length: floors }).map((_, floorIdx) => (
              <div key={floorIdx}>
                <p className="text-sm text-center mb-2">
                  {floorIdx === 0 ? "Tầng dưới" : "Tầng trên"}
                </p>

                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, 40px)`,
                  }}
                >
                  {Array.from({ length: rows * cols }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 border border-dashed rounded-md bg-gray-50"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-semibold mb-4">Danh sách sơ đồ mẫu</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Tên sơ đồ</th>
                <th className="px-4 py-3">Kích thước</th>
                <th className="px-4 py-3">Số tầng</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Chưa có mẫu nào</td>
                </tr>
              ) : (
                templates.map((t) => {
                  const allowCompanyAction = isOwnedByCurrentCompany(t);
                  const canInteract = !isBusCompany || allowCompanyAction;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium">{t.layout_name}</td>
                      <td className="px-4 py-3">{t.total_rows} x {t.total_columns}</td>
                      <td className="px-4 py-3">{t.floor_count} tầng</td>
                      <td className="px-4 py-3 text-right">
                        {canInteract ? (
                          <div className="flex justify-end gap-1">
                            <Tooltip title="Chỉnh sửa">
                              <IconButton 
                                color="primary"
                                onClick={() => handleEdit(t)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Xóa mẫu">
                              <IconButton 
                                color="error"
                                onClick={() => {
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!"
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      const success = await seatService.deleteTemplate(t.id!);
                                      if (success) {
                                        triggerRefresh();
                                        Swal.fire({
                                          title: "Deleted!",
                                          text: "Your file has been deleted.",
                                          icon: "success"
                                        });
                                      } else {
                                        Swal.fire("Lỗi!", "Không thể xóa mẫu này.", "error");
                                      }
                                    }
                                  });
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : (
                          <span className="text-gray-300">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
