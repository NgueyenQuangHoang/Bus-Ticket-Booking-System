import icon1 from '../../../../assets/icon/i1.png';
import icon2 from '../../../../assets/icon/i2.png';
import icon3 from '../../../../assets/icon/i3.png';
import icon4 from '../../../../assets/icon/i4.png';

export default function ConnectIcon() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 ml-15">
                <span className="w-1 h-6 bg-orange-500 rounded"></span>
                <h2 className="text-xl font-semibold">Nền Tảng Kết Nối Người Dùng Và Nhà xe</h2>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 ml-15">

                <div className="flex items-start gap-5">
                    <div className="shrink-0 pt-1">
                        <img src={icon1} alt="Đáp ứng mọi nhu cầu" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-base text-[#111111] uppercase">
                            ĐÁP ỨNG MỌI NHU CẦU TÌM KIẾM
                        </h3>
                        <p className="text-[14px] text-[#000000] leading-5">
                            Với hơn 5000+ tuyến đường và 1500+ nhà xe trên khắp cả nước
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-5">
                    <div className="shrink-0 pt-1">
                        <img src={icon2} alt="Đảm bảo có vé" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-base text-[#111111] uppercase">
                            ĐẢM BẢO CÓ VÉ
                        </h3>
                        <p className="text-[14px] text-[#000000] leading-5">
                            Hoàn ngay 150% nếu không có vé, mang đến hành trình trọn vẹn
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-5">
                    <div className="shrink-0 pt-1">
                        <img src={icon3} alt="Cam kết giữ vé" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-base text-[#111111] uppercase">
                            CAM KẾT GIỮ VÉ
                        </h3>
                        <p className="text-[14px] text-[#000000] leading-5">
                            Vivutoday cam kết hoàn 150% nếu nhà xe không giữ vé
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-5">
                    <div className="shrink-0 pt-1">
                        <img src={icon4} alt="Tổng đài hỗ trợ" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-base text-[#111111] uppercase">
                            TỔNG ĐÀI HỖ TRỢ KHÁCH HÀNG 24/7
                        </h3>
                        <p className="text-[14px] text-[#000000] leading-5">
                            Giải quyết kịp thời vấn đề của khách hàng một cách nhanh chóng
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
