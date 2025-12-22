export default function AboutSystem() {
  return (
    <section className="w-full py-10 lg:py-16 bg-white font-['Segoe_UI']">
      <div className="container mx-auto px-4 lg:px-[100px]">
        {/* === PHẦN HEADER (col small-12 large-12) === */}
        <div className="w-full mb-10 text-center lg:text-left">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-black mb-4">
            Hệ thống đặt vé xe toàn quốc{" "}
            <span className="text-[#FF8D00]">Vivutoday.com</span>
          </h2>
          <div className="text-[#333333] text-[16px] lg:text-[20px] leading-relaxed max-w-[1100px]">
            <p>
              Trong thời đại số hóa ngày nay, việc sử dụng công nghệ thông tin
              để giải quyết nhu cầu của cuộc sống trở nên quen thuộc. Khi bạn
              cần tìm một trang web đáng tin cậy để đặt vé xe, VivuToday.com sẽ
              là người bạn đáng tin để giúp bạn di chuyển một cách an toàn và
              tiện lợi.
            </p>
          </div>
        </div>

        {/* === PHẦN GRID (ROW chứa 3 CARD) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div
            className="
            bg-[#0094DE] rounded-[15px] p-6 lg:p-8
            min-h-[300px] lg:min-h-[370px]
            flex flex-col justify-between
          "
          >
            <div className="text-white text-[18px] lg:text-[20px] leading-relaxed">
              <p>
                Chúng tôi <strong>cam kết đảm bảo</strong> cho bạn môi trường
                đáng tin cậy để đặt vé xe. Với việc kiểm tra độ tin cậy và sự
                hợp tác với các đối tác uy tín, chúng tôi đảm bảo mỗi chuyến đi
                của bạn diễn ra <strong>an toàn và suôn sẻ</strong>.
              </p>
            </div>

            <div className="mt-4">
              <p className="text-white font-bold text-[22px] lg:text-[24px]">
                An Toàn Được Đảm Bảo
              </p>
            </div>
          </div>

          {/* --- CARD 2: MÀU XANH NHẠT --- */}
          <div
            className="
            bg-[#00B3DB] rounded-[15px] p-6 lg:p-8
            min-h-[300px] lg:min-h-[370px]
            flex flex-col justify-between
          "
          >
            {/* Nội dung (txt-1) */}
            <div className="text-white text-[18px] lg:text-[20px] leading-relaxed">
              <p>
                Với đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng{" "}
                <strong>hỗ trợ 24/7</strong>, chúng tôi sẽ giúp bạn mọi lúc bạn
                cần. Điều này đảm bảo bạn luôn có{" "}
                <strong>một người bạn đồng hành đáng tin</strong> trong mỗi hành
                trình.
              </p>
            </div>
            {/* Tiêu đề (txt-2) */}
            <div className="mt-4">
              <p className="text-white font-bold text-[22px] lg:text-[24px]">
                Hỗ Trợ Tận Tâm
              </p>
            </div>
          </div>

          {/* --- CARD 3: NỀN TRẮNG VIỀN CAM --- */}
          {/* Class: box-content box-content--ct-2 */}
          <div
            className="
            bg-white border-[2px] border-[#FF8D00] rounded-[15px] p-6 lg:p-8
            min-h-[300px] lg:min-h-[370px]
            flex flex-col justify-between
          "
          >
            {/* Nội dung (txt-1) */}
            <div className="text-black text-[18px] lg:text-[20px] leading-relaxed flex flex-col gap-2">
              <p>
                <span className="text-[#FF8D00]">
                  <strong>
                    <span className="text-[36px] lg:text-[40px] leading-none">
                      1500+
                    </span>
                  </strong>{" "}
                  nhà xe
                </span>
              </p>
              <p>
                <span className="text-[#FF8D00]">
                  <strong>
                    <span className="text-[36px] lg:text-[40px] leading-none">
                      5000+
                    </span>
                  </strong>{" "}
                  lịch trình
                </span>
              </p>
              <p className="mt-2">
                Chúng tôi cung cấp nhiều sự lựa chọn để đáp ứng mọi nhu cầu của
                khách hàng.
              </p>
            </div>
            {/* Tiêu đề (txt-2) */}
            <div className="mt-4">
              {/* HTML gốc để màu mặc định hoặc class riêng, thường là màu xanh Vivu hoặc đen */}
              <p className="text-[#0094DE] font-bold text-[22px] lg:text-[24px]">
                Đa Dạng Sự Lựa Chọn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
