export default function AboutSystem() {
  return (
    <section className="w-full bg-white font-['Segoe_UI'] py-8 sm:py-10 lg:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="w-full mb-8 sm:mb-10 text-left">
          <h2 className="font-bold text-[20px] sm:text-[24px] lg:text-[36px] leading-[28px] sm:leading-[32px] lg:leading-[48px] text-black mb-3 sm:mb-4">
            Hệ thống đặt vé xe toàn quốc{" "}
            <span className="text-[#FF8D00]">Vivutoday.com</span>
          </h2>
          <p className="text-[#333333] text-[16px] lg:text-[20px] leading-[24px] lg:leading-[32px]">
            Trong thời đại số hóa ngày nay, việc sử dụng công nghệ thông tin để
            giải quyết nhu cầu của cuộc sống trở nên quen thuộc. Khi bạn cần tìm
            một trang web đáng tin cậy để đặt vé xe, VivuToday.com sẽ là người
            bạn đáng tin để giúp bạn di chuyển một cách an toàn và tiện lợi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="bg-[#0094DE] rounded-[15px] p-5 sm:p-6 lg:p-8 min-h-[180px] sm:min-h-[200px] lg:min-h-[300px] flex flex-col justify-between">
            <p className="text-white text-[14px] sm:text-[16px] lg:text-[20px] leading-[20px] sm:leading-[24px] lg:leading-[32px]">
              Chúng tôi <strong>cam kết đảm bảo</strong> cho bạn môi trường đáng
              tin cậy để đặt vé xe. Với việc kiểm tra độ tin cậy và sự hợp tác
              với các đối tác uy tín, chúng tôi đảm bảo mỗi chuyến đi của bạn
              diễn ra <strong>an toàn và suôn sẻ</strong>.
            </p>
            <p className="mt-4 text-white font-bold text-[20px] sm:text-[22px] lg:text-[24px]">
              An Toàn Được Đảm Bảo
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#00B3DB] rounded-[15px] p-5 sm:p-6 lg:p-8 min-h-[180px] sm:min-h-[200px] lg:min-h-[300px] flex flex-col justify-between">
            <p className="text-white text-[14px] sm:text-[16px] lg:text-[20px] leading-[20px] sm:leading-[24px] lg:leading-[32px]">
              Với đội ngũ tư vấn viên chuyên nghiệp luôn sẵn sàng{" "}
              <strong>hỗ trợ 24/7</strong>, chúng tôi sẽ giúp bạn mọi lúc bạn
              cần. Điều này đảm bảo bạn luôn có{" "}
              <strong>một người bạn đồng hành đáng tin</strong> trong mỗi hành
              trình.
            </p>
            <p className="mt-4 text-white font-bold text-[20px] sm:text-[22px] lg:text-[24px]">
              Hỗ Trợ Tận Tâm
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-2 border-[#FF8D00] rounded-[15px] p-5 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[220px] lg:min-h-[300px] flex flex-col justify-between">
            <div className="text-black text-[16px] lg:text-[20px] leading-[24px] lg:leading-[32px] flex flex-col gap-2">
              <p>
                <span className="text-[#FF8D00] flex items-baseline gap-1">
                  <strong className="text-[32px] sm:text-[36px] lg:text-[40px] leading-none">
                    1500+
                  </strong>
                  <span className="text-[18px] sm:text-[20px] lg:text-[22px]">
                    nhà xe
                  </span>
                </span>
              </p>
              <p>
                <span className="text-[#FF8D00] flex items-baseline gap-1">
                  <strong className="text-[32px] sm:text-[36px] lg:text-[40px] leading-none">
                    5000+
                  </strong>
                  <span className="text-[18px] sm:text-[20px] lg:text-[22px]">
                    lịch trình
                  </span>
                </span>
              </p>
              <p className="mt-2">
                Chúng tôi cung cấp nhiều sự lựa chọn để đáp ứng mọi nhu cầu của
                khách hàng.
              </p>
            </div>
            <p className="mt-4 text-[#0094DE] font-bold text-[20px] sm:text-[22px] lg:text-[24px]">
              Đa Dạng Sự Lựa Chọn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
