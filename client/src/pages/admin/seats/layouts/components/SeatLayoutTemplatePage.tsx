import { useState } from "react";
import seatService from "../../../../../services/admin/seatService";
// import { useNavigate } from "react-router-dom";

export default function SeatLayoutTemplatePage() {
  const [layoutName, setLayoutName] = useState("");
  const [rows, setRows] = useState(7);
  const [cols, setCols] = useState(5);
  const [floors, setFloors] = useState<1 | 2>(1);
  // const navigate = useNavigate();

  const handleSave = async () => {
    if (!layoutName) {
      alert("Vui lòng nhập tên sơ đồ");
      return;
    }

    const templateData = {
      name: layoutName,
      rows: rows,
      cols: cols,
      floors: floors,
      created_at: new Date().toISOString()
    };

    const result = await seatService.createTemplate(templateData);
    if (result) {
      alert("Đã lưu sơ đồ mẫu thành công!");
      // Optionally navigate or reset
      // navigate('/admin/seat-maps'); 
    } else {
      alert("Lỗi khi lưu sơ đồ mẫu");
    }
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
            Lưu sơ đồ mẫu
          </button>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="col-span-8 bg-white rounded-xl p-4 border">
          <h2 className="font-semibold mb-4">Xem trước sơ đồ</h2>

          <div className="flex gap-6">
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
    </div>
  );
}
