
import { useState } from "react";

type Mode = "idle" | "detail" | "booking";
// "idle"     // không mở gì
// "detail"   // xem thông tin chi tiết
// "booking"  // chọn chuyến / chọn ghế
type DetailTab = "discount" | "pickup";
// "discount" // tab giảm giá
// "pickup"   // tab đón / trả

type Trip = {
    id: number;
    name: string;
    departTime: string;
    endTime: string
    price: number;
    from: string;
    to: string;
    description: string;
    seats: number;
    type: string;
    numberReview: number
};

type ListVehicleImage = {
    trip_id: number,
    image: string
}

export default function TripCard() {
    // ===== DATA GIẢ =====
    const trips: Trip[] = [
        {
            id: 1,
            name: "Tây Nguyên",
            departTime: "10.00",
            endTime: "11.00",
            price: 250000,
            from: "Ha noi",
            to: "Do son",
            description: "day la chuyen di tu ha noi den do son",
            seats: 10,
            type: "Limozin 9cho",
            numberReview: 21
        },
    ];

    const listImageVehicle: ListVehicleImage[] = [
        {
            trip_id: 1,
            image: '../../../public/bookingticket.jpg'
        },
        {
            trip_id: 1,
            image: '../../../public/bookingticket.jpg'
        }
    ]

    // ===== STATE ĐIỀU KHIỂN =====
    const [activeTripId, setActiveTripId] = useState<number | null>(null); // chuyến nào đang được chọn
    const [mode, setMode] = useState<Mode>("idle"); //đang xem chi tiết hay booking
    const [detailTab, setDetailTab] = useState<DetailTab>("discount"); //tab con bên trong chi tiết
    const [idTripOpen, setIdTripOpen] = useState<number>(0)
    const [currentImg] = useState<number>(0)

    return (
        <div className="w-full mx-auto space-y-6">
            {trips.map((trip) => {
                const isActive = activeTripId === trip.id;
                // Nếu true → card này được phép mở
                // Nếu false → card này BỊ CẤM mở

                return (
                    <div
                        key={trip.id}
                        className="border rounded-lg"
                    >
                        {/* ===== SUMMARY ===== */}
                        <div className="flex xl:flex-row flex-col justify-between">
                            <div className="flex gap-3 py-3">
                                <img src="../../../public/bookingticket.jpg" className="xl:w-25 xl:h-25 md:w-40 md:h-40 w-30 h-30 object-cover p-2" alt="" />
                                <div className="flex flex-col xl:gap-2 md:gap-5 xl:w-125 md:flex-1 p-3">
                                    <h3 className="font-semibold text-lg">
                                        {trip.name} ⭐ 4.8 <span className="text-[10px] text-gray-400">{trip.numberReview} Đánh giá</span>
                                        <p className="text-sm text-gray-400">{trip.type}</p>
                                    </h3>
                                    <div className="text-xl font-bold text-gray-500 flex justify-between">
                                        <p>{trip.departTime}</p>
                                        <span>===&gt;</span>
                                        <p>{trip.endTime}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-lg text-blue-500">{trip.from}</p>
                                        <p className="text-lg text-blue-500">{trip.to}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-lg">*{trip.description}</p>
                                        <button
                                            onClick={() => {
                                                setIdTripOpen(trip.id)
                                                if (isActive && mode === "detail") {
                                                    setActiveTripId(null);
                                                    setMode("idle");
                                                } else {
                                                    setActiveTripId(trip.id);
                                                    setMode("detail");
                                                }
                                            }}
                                            className="text-blue-600 underline xl:block hidden"
                                        >
                                            Thông tin chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex xl:flex-col flex-row gap-3 p-3 xl:item-ends justify-between">

                                <div className="flex xl:flex-row flex-col">
                                    <h3 className="text-xl text-gray-600">Từ <b>{trip.price}</b>đ</h3>
                                    <h4 className="text-lg">{trip.seats} Còn trống</h4>
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveTripId(trip.id);
                                        setMode("booking");
                                    }}
                                    className="bg-yellow-400 px-4 py-2 rounded"
                                >
                                    Chọn chuyến
                                </button>
                            </div>
                        </div>

                        {/* ===== DETAIL PANEL ===== */}
                        {isActive && mode === "detail" && (
                            <div className="mt-4 border-t pt-4">
                                <div className="flex gap-6 justify-center border-b mb-4">
                                    <button
                                        onClick={() => {
                                            setDetailTab("discount")
                                        }}
                                        className={`pb-2 ${detailTab === "discount"
                                            ? "border-b-2 border-blue-600 text-blue-600"
                                            : ""
                                            }`}
                                    >
                                        Hình ảnh
                                    </button>

                                    <button
                                        onClick={() => setDetailTab("pickup")}
                                        className={`pb-2 ${detailTab === "pickup"
                                            ? "border-b-2 border-blue-600 text-blue-600"
                                            : ""
                                            }`}
                                    >
                                        Phí huỷ chuyển
                                    </button>
                                </div>

                                {detailTab === "discount" && (
                                    <div className="p-4 flex justify-center bg-gray-100 rounded">
                                        {listImageVehicle.filter(item => item.trip_id == idTripOpen)
                                            .slice(currentImg, currentImg + 1)
                                            .map((item) => {
                                                return (
                                                    <img src={item.image} alt="" />
                                                )
                                            })}
                                    </div>
                                )}

                                {detailTab === "pickup" && (
                                    <div className="p-4 flex justify-center bg-gray-100 rounded">
                                        <div className="max-w-md mx-auto p-6 bg-white font-sans text-sm text-gray-800">
                                            <div className="grid grid-cols-3 gap-4 mb-4 font-bold">
                                                <div>Hủy từ</div>
                                                <div>Đến trước</div>
                                                <div>Phí hủy</div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 py-4 border-t border-dashed border-gray-300">
                                                <div className="text-gray-600">Sau khi đặt</div>
                                                <div>
                                                    <p>06:45</p>
                                                    <p>25/11/2024</p>
                                                </div>
                                                <div>
                                                    <p>0%</p>
                                                    <p>giá trị đơn hàng</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 py-4 border-t border-dashed border-gray-300">
                                                <div>
                                                    <p>06:45</p>
                                                    <p>25/11/2024</p>
                                                </div>
                                                <div className="text-gray-600">Giờ khởi hành</div>
                                                <div>
                                                    <p>100%</p>
                                                    <p>giá trị đơn hàng</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                                <p className="font-bold mb-2 text-gray-900">Ghi chú:</p>
                                                <p className="text-gray-700 leading-relaxed text-xs">
                                                    Phí huỷ sẽ được tính trên giá gốc, không giảm trừ khuyến mãi
                                                    hoặc giảm giá; đồng thời không vượt quá số tiền quý khách đã
                                                    thanh toán.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== BOOKING PANEL ===== */}
                        {isActive && mode === "booking" && (
                            <div className="mt-4 border-t pt-4">
                                <div className="p-4 bg-yellow-100 rounded">
                                    👉 Đây là component <b>Chọn ghế</b> của chuyến{" "}
                                    <b>{trip.name}</b>
                                </div>

                                <button
                                    onClick={() => {
                                        setActiveTripId(null);
                                        setMode("idle");
                                    }}
                                    className="mt-3 text-red-600 underline"
                                >
                                    Đóng chọn chuyến
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
