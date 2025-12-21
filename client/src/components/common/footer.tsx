import dmca from "../../assets/dmma1.png";
import bct from "../../assets/bct1.png";
import verified from "../../assets/verify.png";

export default function Footer() {
  return (
    <footer className="bg-[#fdf5ef] text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ================= MOBILE (<= 767px) ================= */}
        <div className="block md:hidden space-y-8">

          {/* Tin tức */}
          <div>
            <h3 className="font-semibold mb-3">Tin tức</h3>
            <ul className="space-y-2">
              <li>Xe Limousine – Đẳng cấp hạng thương gia thời đại mới</li>
              <li>Tổng quan các bến xe Vũng Tàu – Giới thiệu thông tin lịch trình nhà xe</li>
              <li>Top 31 nhà xe limousine, xe giường nằm đi Đà Lạt</li>
            </ul>
          </div>

          {/* Tuyến đường */}
          <div>
            <h3 className="font-semibold mb-3">Tuyến đường</h3>
            <ul className="space-y-2">
              <li>Xe đi Buôn Mê Thuột từ Sài Gòn</li>
              <li>Xe đi Vũng Tàu từ Sài Gòn</li>
              <li>Xe đi Nha Trang từ Sài Gòn</li>
              <li>Xe đi Đà Lạt từ Sài Gòn</li>
              <li>Xe đi Sapa từ Hà Nội</li>
              <li>Xe đi Hải Phòng từ Hà Nội</li>
              <li>Xe đi Vinh từ Hà Nội</li>
            </ul>
          </div>

          {/* Xe Limousine */}
          <div>
            <h3 className="font-semibold mb-3">Xe Limousine</h3>
            <ul className="space-y-2">
              <li>Xe Limousine đi Đà Lạt từ Sài Gòn</li>
              <li>Xe Limousine đi Vũng Tàu từ Sài Gòn</li>
              <li>Xe Limousine đi Nha Trang từ Sài Gòn</li>
            </ul>
          </div>

          {/* ===== BẾN XE | NHÀ XE (THẲNG HÀNG) ===== */}
          <div className="grid grid-cols-2 gap-6">

            {/* Tiêu đề */}
            <h3 className="font-semibold mb-3">Bến xe</h3>
            <h3 className="font-semibold mb-3">Nhà xe</h3>

            {/* Cột trái */}
            <ul className="space-y-2">
              <li>Bến xe Miền Đông</li>
              <li>Bến xe Trung tâm Đà Nẵng</li>
              <li>Bến xe Gia Lâm</li>
              <li>Bến xe Mỹ Đình</li>
              <li>Bến xe An Sương</li>
              <li>Bến xe Nước Ngầm</li>
              <li>Bến xe Miền Tây</li>

              <li className="pt-4">Xe Hải Âu</li>
              <li>Xe Chính Nghĩa</li>
              <li>Xe Hưng Long</li>
              <li>Xe Kim Mạnh Hùng</li>
              <li>Xe Tuấn Hưng</li>
              <li>Xe Khanh Phong</li>
              <li>Xe An Anh (Quế Hương)</li>
              <li>Xe Minh Quốc</li>
            </ul>

            {/* Cột phải */}
            <ul className="space-y-2">
              <li>Xe Sao Việt</li>
              <li>Xe Hoa Mai</li>
              <li>Xe Hạ Long Travel</li>
              <li>Xe Quốc Đạt</li>
              <li>Xe Thanh Bình Xanh</li>
              <li>Xe Thiên Thành Limousine</li>
              <li>Xe Hồng Sơn Phú Yên</li>
              <li>Xe Tiến Oanh</li>
              <li>Xe Văn Minh</li>
              <li>Xe Anh Tuyên</li>
              <li>Xe Điền Linh</li>
              <li>Xe Hạnh Cafe</li>
              <li>Xe Tuấn Nga</li>
              <li>Xe Ngọc Ánh Sài Gòn</li>
              <li>Xe Hùng Cường</li>
              <li>Xe Thuận Tiến</li>
            </ul>
          </div>

          {/* Về chúng tôi | Hỗ trợ */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Về Chúng Tôi</h3>
              <ul className="space-y-2">
                <li>Giới thiệu Vivutoday</li>
                <li>Liên hệ</li>
                <li>Giá trị cốt lõi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Hỗ Trợ</h3>
              <ul className="space-y-2">
                <li>Chính sách bảo mật</li>
                <li>Chính sách điều khoản</li>
                <li>Chính sách hoàn tiền</li>
              </ul>
            </div>
          </div>

          {/* Liên hệ | Chứng nhận */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Liên hệ</h3>
              <ul className="space-y-2">
                <li>1900 0152</li>
                <li>1900 996 678</li>
                <li>1900 0179</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Chứng nhận</h3>
              <div className="space-y-2">
                <img src={dmca} className="w-24" />
                <img src={bct} className="w-24" />
                <img src={verified} className="w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= TABLET (GIỮ NGUYÊN CODE CŨ) ================= */}
        <div className="hidden md:grid grid-cols-2 gap-10 lg:hidden">
 {/* ===== CỘT TRÁI ===== */}
          <div className="space-y-10">
            {/* Tin tức */}
            <div>
              <h3 className="font-semibold mb-4">Tin tức</h3>
              <ul className="space-y-2">
                <li>Xe Limousine – Đẳng cấp hạng thương gia thời đại mới</li>
                <li>
                  Tổng quan các bến xe Vũng Tàu – Giới thiệu thông tin lịch trình nhà xe
                </li>
                <li>Top 31 nhà xe limousine, xe giường nằm đi Đà Lạt</li>
              </ul>
            </div>

            {/* Tuyến đường */}
            <div>
              <h3 className="font-semibold mb-4">Tuyến đường</h3>
              <ul className="space-y-2">
                <li>Xe đi Buôn Mê Thuột từ Sài Gòn</li>
                <li>Xe đi Vũng Tàu từ Sài Gòn</li>
                <li>Xe đi Nha Trang từ Sài Gòn</li>
                <li>Xe đi Đà Lạt từ Sài Gòn</li>
                <li>Xe đi Sapa từ Hà Nội</li>
                <li>Xe đi Hải Phòng từ Hà Nội</li>
                <li>Xe đi Vinh từ Hà Nội</li>
              </ul>
            </div>

            {/* Xe Limousine */}
            <div>
              <h3 className="font-semibold mb-4">Xe Limousine</h3>
              <ul className="space-y-2">
                <li>Xe Limousine đi Đà Lạt từ Sài Gòn</li>
                <li>Xe Limousine đi Vũng Tàu từ Sài Gòn</li>
                <li>Xe Limousine đi Nha Trang từ Sài Gòn</li>
                <li>Xe Limousine đi Hải Phòng từ Hà Nội</li>
                <li>Xe Limousine đi Hạ Long từ Hà Nội</li>
                <li>Xe Limousine đi Sapa từ Hà Nội</li>
                <li>Xe Limousine đi Quảng Ninh từ Hà Nội</li>
              </ul>
            </div>

            {/* Về chúng tôi */}
{/* Về chúng tôi */}
<div className="mt-82">   
  <h3 className="font-semibold mb-4">Về Chúng Tôi</h3>
  <ul className="space-y-2">
    <li>Giới thiệu Vivutoday</li>
    <li>Liên hệ</li>
    <li>Giá trị cốt lõi</li>
  </ul>
</div>


            {/* Liên hệ */}
            <div className="mt-24">
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2">
                <li>
                  Hotline: <b>1900 0152</b>
                </li>
                <li>
                  Hotline: <b>1900 996 678</b>
                </li>
                <li>
                  Hotline: <b>1900 0179</b>
                </li>
              </ul>
            </div>
          </div>

          {/* ===== CỘT PHẢI ===== */}
          <div className="space-y-10">
            {/* Bến xe */}
            <div>
              <h3 className="font-semibold mb-4">Bến xe</h3>
              <ul className="space-y-2">
                <li>Bến xe Miền Đông</li>
                <li>Bến xe Trung tâm Đà Nẵng</li>
                <li>Bến xe Gia Lâm</li>
                <li>Bến xe Mỹ Đình</li>
                <li>Bến xe An Sương</li>
                <li>Bến xe Nước Ngầm</li>
                <li>Bến xe Miền Tây</li>
              </ul>
            </div>

            {/* Nhà xe */}
            <div>
              <h3 className="font-semibold mb-4">Nhà xe</h3>
              <ul className="space-y-2 columns-2 md:columns-1">
                <li>Xe Sao Việt</li>
                <li>Xe Hoa Mai</li>
                <li>Xe Hạ Long Travel</li>
                <li>Xe Quốc Đạt</li>
                <li>Xe Thanh Bình Xanh</li>
                <li>Xe Thiên Thành Limousine</li>
                <li>Xe Hồng Sơn Phú Yên</li>
                <li>Xe Tiến Oanh</li>
                <li>Xe Hải Âu</li>
                <li>Xe Chính Nghĩa</li>
                <li>Xe Hưng Long</li>
                <li>Xe Kim Mạnh Hùng</li>
                <li>Xe Tuấn Hưng</li>
                <li>Xe Khanh Phong</li>
                <li>Xe An Anh (Quế Hương)</li>
                <li>Xe Minh Quốc</li>
                <li>Xe Văn Minh</li>
                <li>Xe Anh Tuyên</li>
                <li>Xe Điền Linh</li>
                <li>Xe Hạnh Cafe</li>
                <li>Xe Tuấn Nga</li>
                <li>Xe Ngọc Ánh Sài Gòn</li>
                <li>Xe Hùng Cường</li>
                <li>Xe Thuận Tiến</li>
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h3 className="font-semibold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2">
                <li>Chính sách bảo mật</li>
                <li>Chính sách điều khoản & giao dịch</li>
                <li>Chính sách đổi trả & hoàn tiền</li>
                <li>Chính sách thanh toán</li>
                <li>Quy chế hoạt động</li>
              </ul>
            </div>

            {/* Chứng nhận */}
            <div>
              <h3 className="font-semibold mb-4">Chứng nhận</h3>
              <div className="space-y-3">
                <img src={dmca} alt="DMCA" className="w-28" />
                <img src={bct} alt="Bộ Công Thương" className="w-28" />
                <img src={verified} alt="Verified" className="w-28" />
              </div>
            </div>
          </div>        </div>

        {/* ================= DESKTOP (GIỮ NGUYÊN CODE CŨ) ================= */}
        <div className="hidden lg:block">
          {/* 👉 DÁN NGUYÊN BLOCK DESKTOP CŨ CỦA BẠN VÀO ĐÂY */}
          <div className="max-w-7xl mx-auto px-6 py-12">

            {/* ===== KHỐI 1 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
              <div>
                <h3 className="font-semibold mb-4">Tin tức</h3>
                <ul className="space-y-2">
                  <li>Xe Limousine – Đẳng cấp hạng thương gia thời đại mới</li>
                  <li>
                    Tổng quan các bến xe Vũng Tàu – Giới thiệu thông tin lịch trình nhà xe
                  </li>
                  <li>Top 31 nhà xe limousine, xe giường nằm đi Đà Lạt</li>
                </ul>
              </div>

              <div className="hidden lg:block" />

              <div>
                <h3 className="font-semibold mb-4">Tuyến đường</h3>
                <ul className="space-y-2">
                  <li>Xe đi Buôn Mê Thuột từ Sài Gòn</li>
                  <li>Xe đi Vũng Tàu từ Sài Gòn</li>
                  <li>Xe đi Nha Trang từ Sài Gòn</li>
                  <li>Xe đi Đà Lạt từ Sài Gòn</li>
                  <li>Xe đi Sapa từ Hà Nội</li>
                  <li>Xe đi Hải Phòng từ Hà Nội</li>
                  <li>Xe đi Vinh từ Hà Nội</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Xe Limousine</h3>
                <ul className="space-y-2">
                  <li>Xe Limousine đi Đà Lạt từ Sài Gòn</li>
                  <li>Xe Limousine đi Vũng Tàu từ Sài Gòn</li>
                  <li>Xe Limousine đi Nha Trang từ Sài Gòn</li>
                  <li>Xe Limousine đi Hải Phòng từ Hà Nội</li>
                  <li>Xe Limousine đi Hạ Long từ Hà Nội</li>
                  <li>Xe Limousine đi Sapa từ Hà Nội</li>
                  <li>Xe Limousine đi Quảng Ninh từ Hà Nội</li>
                </ul>
              </div>
            </div>

            {/* ===== KHỐI 2 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
              <div>
                <h3 className="font-semibold mb-4">Bến xe</h3>
                <ul className="space-y-2">
                  <li>Bến xe Miền Đông</li>
                  <li>Bến xe Trung tâm Đà Nẵng</li>
                  <li>Bến xe Gia Lâm</li>
                  <li>Bến xe Mỹ Đình</li>
                  <li>Bến xe An Sương</li>
                  <li>Bến xe Nước Ngầm</li>
                  <li>Bến xe Miền Tây</li>
                </ul>
              </div>

              <div className="hidden lg:block" />

              <div>
                <h3 className="font-semibold mb-4">Nhà xe</h3>
                <ul className="space-y-2">
                  <li>Xe Sao Việt</li>
                  <li>Xe Hoa Mai</li>
                  <li>Xe Hạ Long Travel</li>
                  <li>Xe Quốc Đạt</li>
                  <li>Xe Thanh Bình Xanh</li>
                  <li>Xe Thiên Thành Limousine</li>
                  <li>Xe Hồng Sơn Phú Yên</li>
                  <li>Xe Tiến Oanh</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 md:hidden lg:block opacity-0">.</h3>
                <ul className="space-y-2">
                  <li>Xe Hải Âu</li>
                  <li>Xe Chính Nghĩa</li>
                  <li>Xe Hưng Long</li>
                  <li>Xe Kim Mạnh Hùng</li>
                  <li>Xe Tuấn Hưng</li>
                  <li>Xe Khanh Phong</li>
                  <li>Xe An Anh (Quế Hương)</li>
                  <li>Xe Minh Quốc</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 md:hidden lg:block opacity-0">.</h3>
                <ul className="space-y-2">
                  <li>Xe Văn Minh</li>
                  <li>Xe Anh Tuyên</li>
                  <li>Xe Điền Linh</li>
                  <li>Xe Hạnh Cafe</li>
                  <li>Xe Tuấn Nga</li>
                  <li>Xe Ngọc Ánh Sài Gòn</li>
                  <li>Xe Hùng Cường</li>
                  <li>Xe Thuận Tiến</li>
                </ul>
              </div>
            </div>

            {/* ===== KHỐI 3 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Về Chúng Tôi</h3>
                <ul className="space-y-2">
                  <li>Giới thiệu Vivutoday</li>
                  <li>Liên hệ</li>
                  <li>Giá trị cốt lõi</li>
                </ul>
              </div>

              <div className="hidden lg:block" />

              <div>
                <h3 className="font-semibold mb-4">Hỗ Trợ</h3>
                <ul className="space-y-2">
                  <li>Chính sách bảo mật</li>
                  <li>Chính sách điều khoản & giao dịch</li>
                  <li>Chính sách đổi trả & hoàn tiền</li>
                  <li>Chính sách thanh toán</li>
                  <li>Quy chế hoạt động</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Liên hệ</h3>
                <ul className="space-y-2">
                  <li>
                    Hotline: <b>1900 0152</b>
                  </li>
                  <li>
                    Hotline: <b>1900 996 678</b>
                  </li>
                  <li>
                    Hotline: <b>1900 0179</b>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Chứng nhận</h3>
                <div className="space-y-3">
                  <img src={dmca} className="w-28" />
                  <img src={bct} className="w-28" />
                  <img src={verified} className="w-28" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
