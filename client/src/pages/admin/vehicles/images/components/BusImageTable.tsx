import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Item = {
    id: number;
    image: string;
    bus: string;
};

type Props = {
    data: Item[];
};

export default function BusImageTable({ data }: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* ===== SEARCH BAR (UI ONLY) ===== */}
            <div
                className="
          p-4 border-b border-gray-100
          flex flex-col gap-3
          [@media(min-width:391px)]:flex-row
          [@media(min-width:391px)]:items-center
          [@media(min-width:391px)]:justify-between
        "
            >
                <input
                    placeholder="Tìm kiếm xe..."
                    className="  w-full max-w-sm border border-gray-300 px-3 py-2 text-sm  rounded-lg focus:outline-none focus:border-blue-500
          "
                />

                <span className="text-sm text-gray-500">
                    Tổng:&nbsp;
                    <span className="font-semibold text-gray-700">
                        {data.length}
                    </span>
                </span>
            </div>

            {/* ===== TABLE (ONE MAP ONLY) ===== */}
            <table className="w-full text-sm">
                {/* HEADER – CHỈ HIỆN DESKTOP >= 769px */}
                <thead
                    className="
            bg-gray-50 text-gray-500
            hidden
            [@media(min-width:769px)]:table-header-group
          "
                >
                    <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-medium">ID</th>
                        <th className="px-4 py-3 text-left font-medium">Hình ảnh</th>
                        <th className="px-4 py-3 text-left font-medium">Xe</th>
                        <th className="px-4 py-3 text-center font-medium">Thao tác</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-gray-700">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="
                hover:bg-gray-50 transition
                block
                [@media(min-width:769px)]:table-row
              "
                        >
                            {/* ID – CHỈ DESKTOP */}
                            <td
                                className="  px-4 py-2 hidden [@media(min-width:769px)]:table-cell  "   >
                                {item.id}
                            </td>

                            {/* IMAGE */}
                            <td
                                className="
                  px-4 py-2
                  block
                  [@media(min-width:769px)]:table-cell
                "
                            >
                                <img
                                    src={item.image}
                                    alt=""
                                    className="
                    w-full h-44 object-cover rounded-lg border border-gray-200
                    [@media(min-width:391px)]:h-36
                    [@media(min-width:769px)]:w-40
                    [@media(min-width:769px)]:h-24
                  "
                                />
                            </td>

                            {/* BUS */}
                            <td
                                className="px-4 py-2 block [@media(min-width:769px)]:table-cell
                "
                            >
                                <span
                                    className="
                    block text-xs text-gray-400 mb-1
                    [@media(min-width:769px)]:hidden
                  "
                                >
                                    Xe
                                </span>
                                {item.bus}
                            </td>

                            {/* ACTION */}
                            <td
                                className="
                  px-4 py-2
                  block
                  [@media(min-width:769px)]:table-cell
                  text-right
                  [@media(min-width:769px)]:text-center
                "
                            >
                                <div
                                    className="
                    flex justify-end gap-3
                    [@media(min-width:769px)]:justify-center
                  "
                                >
                                    <EditIcon className="text-gray-400 hover:text-green-600 cursor-pointer transition" />
                                    <DeleteIcon className="text-gray-400 hover:text-red-500 cursor-pointer transition" />
                                </div>
                            </td>
                        </tr>
                    ))}

                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-6 text-center text-gray-400"
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
