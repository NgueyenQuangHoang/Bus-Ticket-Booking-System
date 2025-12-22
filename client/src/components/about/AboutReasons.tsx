export default function AboutReasons() {
  return (
    <section className="w-full bg-white font-['Segoe_UI'] py-8 sm:py-10 lg:py-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Title */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">
          <h2 className="font-bold text-[20px] sm:text-[24px] lg:text-[36px] leading-[28px] sm:leading-[32px] lg:leading-[48px] text-black">
            Lý do bạn nên đặt vé tại{" "}
            <span className="text-[#FF8D00]">Vivutoday.com</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[391px]:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-center">
          <div className="flex flex-col gap-6 lg:gap-[60px] order-1">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#FF8D00] font-bold text-[18px] leading-[32px]">
                Tìm Kiếm Thông Tin Một Cách Dễ Dàng
              </h3>
              <p className="text-[#333333] text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px]">
                Giao diện của VivuToday.com được thiết kế để giúp bạn tìm kiếm
                thông tin nhà xe, giờ khởi hành, điểm xuất phát và đích một cách
                nhanh chóng và dễ dàng. Thông qua việc nhập các thông tin cơ
                bản, bạn có thể tìm kiếm lịch trình phù hợp chỉ trong vài giây.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[#FF8D00] font-bold text-[18px] leading-[32px]">
                Tùy Chỉnh Theo Tài Chính Của Bạn
              </h3>
              <p className="text-[#333333] text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px]">
                Chúng tôi hiểu rằng mỗi hành trình có một ngân sách riêng. Với
                giao diện của chúng tôi, bạn có thể tùy chỉnh lựa chọn những nhà
                xe nằm trong khoảng giá tiền mà bạn mong muốn. Điều này giúp bạn
                tiết kiệm thời gian và tìm được các lựa chọn phù hợp với túi
                tiền.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:gap-[60px] order-2 lg:order-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-[#FF8D00] font-bold text-[18px] leading-[32px]">
                Lựa Chọn Nhà Xe Có Đánh Giá Cao
              </h3>
              <p className="text-[#333333] text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px]">
                Chất lượng là một yếu tố quan trọng. Trên giao diện của
                VivuToday.com, bạn có thể chọn lựa những nhà xe được đánh giá
                cao với mục đánh giá 5 sao. Điều này đảm bảo rằng bạn đang chọn
                một dịch vụ uy tín và chất lượng cho hành trình của mình.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[#FF8D00] font-bold text-[18px] leading-[32px]">
                Thanh Toán An Toàn
              </h3>
              <p className="text-[#333333] text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px]">
                Việc thanh toán không còn là vấn đề khiến bạn lo lắng. Chúng tôi
                cung cấp các phương thức thanh toán đa dạng bao gồm thanh toán
                trực tuyến, qua ngân hàng và epays. Đảm bảo bạn có sự linh hoạt
                trong việc chọn phương thức phù hợp với bạn và đảm bảo tính an
                toàn cho giao dịch.
              </p>
            </div>
          </div>

          <div className="order-3 lg:order-2 min-[391px]:col-span-2 lg:col-span-1 flex flex-col justify-center items-center py-4 sm:py-6 lg:py-0 gap-4">
            {/* Mascot Image */}
            <img
              src="https://res.cloudinary.com/domyfnxuk/image/upload/v1766396918/mascot_fipog9.png"
              alt="VivuToday Mascot"
              className="object-contain w-[215px] h-[295px] lg:w-[354px] lg:h-[450px]"
            />

            {/* Link Image */}
            <img
              src="https://res.cloudinary.com/domyfnxuk/image/upload/v1766396917/Link_niutln.png"
              alt="Link"
              className="object-contain block lg:hidden w-[232px] h-[67px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
