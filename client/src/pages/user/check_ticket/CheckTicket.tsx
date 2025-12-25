import React, { useState } from "react";
import logo1 from "../../../assets/datve.png";

export default function CheckTicket() {
    const [ticketCode, setTicketCode] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({
        ticketCode: "",
        phone: "",
    });

    const handleSubmit = () => {
        const newErrors = {
            ticketCode: "",
            phone: "",
        };

        if (!ticketCode.trim()) {
            newErrors.ticketCode = "Vui lòng nhập mã vé";
        }

        if (!phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        }

        setErrors(newErrors);

    };

    return (
        <section className="bg-white">
            <div className="max-w-[1024px] mx-auto px-3 py-6">
                <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">

                    <div className="text-center">
                        <h2 className="font-bold text-[#0b6fb3] text-2xl mb-3">
                            Nhập thông tin vé xe
                        </h2>

                        <div className="max-w-[334px] mx-auto w-full">
                            <div className="p-4 bg-white rounded">
                                <input
                                    value={ticketCode}
                                    onChange={(e) => {
                                        setTicketCode(e.target.value);
                                        setErrors({ ...errors, ticketCode: "" });
                                    }}
                                    placeholder="Mã vé"
                                    className={`w-full px-3 py-2 text-sm rounded border
                    ${errors.ticketCode
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errors.ticketCode && (
                                    <p className="text-red-500 text-xs mt-1 text-left">
                                        {errors.ticketCode}
                                    </p>
                                )}

                                <input
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setErrors({ ...errors, phone: "" });
                                    }}
                                    placeholder="Số điện thoại (Bắt buộc)"
                                    className={`w-full mt-3 px-3 py-2 text-sm rounded border
                    ${errors.phone
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1 text-left">
                                        {errors.phone}
                                    </p>
                                )}


                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-[#0b6fb3] text-white py-2 text-sm rounded font-medium mt-4"
                                >
                                    Kiểm tra vé
                                </button>


                                <div className="bg-gray-100 text-xs text-gray-600 p-3 mt-4 rounded pb-6">
                                    <p className="font-semibold mb-1">Lưu ý:</p>
                                    <p>
                                        Trường hợp bạn không thể hủy vé qua mạng hoặc muốn đổi sang
                                        đơn hàng khác vui lòng liên hệ tổng đài{" "}
                                        <strong>1900 7070</strong> hoặc{" "}
                                        <strong>1900969681</strong>
                                    </p>
                                </div>


                                <div className="mt-4 md:hidden space-y-4">
                                    <div className="bg-[#e6f4df] text-[#2e7d32] text-sm px-4 py-2 rounded text-center">
                                        Vui lòng nhập vào thông tin và bấm{" "}
                                        <strong>kiểm tra vé</strong>
                                    </div>

                                    <div className="rounded overflow-hidden h-[180px]">
                                        <img
                                            src={logo1}
                                            alt="Đặt vé ngay"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="hidden md:block">
                        <div className="max-w-[334px] w-full lg:max-w-none">
                            <div className="bg-[#e6f4df] text-[#2e7d32] text-sm p-3 mt-4 rounded text-center">
                                Vui lòng nhập vào thông tin và bấm{" "}
                                <strong>kiểm tra vé</strong>
                            </div>

                            <div className="rounded overflow-hidden mt-4 h-[260px]">
                                <img
                                    src={logo1}
                                    alt="Đặt vé ngay"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
