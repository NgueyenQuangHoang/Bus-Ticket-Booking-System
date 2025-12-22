export default function AboutCustomer() {
  return (
    <section className="w-full py-10 lg:py-16 bg-white font-['Segoe_UI']">
      <div className="container mx-auto px-4 lg:px-[100px]">
        {/* --- TIÊU ĐỀ --- */}
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#FF8D00]">
            Khách hàng là trung tâm
          </h2>
        </div>

        <div className="max-w-[1350px] mx-auto text-[#333333] text-[16px] lg:text-[22px] leading-relaxed text-left flex flex-col gap-4">
          <p>
            Chúng tôi luôn đặt “khách hàng là trung tâm” và xem việc làm hài
            lòng, đáp ứng nhu cầu của khách hàng như mục tiêu hàng đầu. Chúng
            tôi lắng nghe và tiếp thu những đóng góp quý báu từ khách hàng, để
            không ngừng hoàn thiện, đổi mới và cung cấp dịch vụ ngày càng tốt
            hơn.
          </p>
          <p>
            Nếu bạn cần di chuyển đến bất kỳ tỉnh thành nào trong cả nước, hãy
            đến với vivutoday.com để trải nghiệm những tiện ích tuyệt vời mà hệ
            thống của chúng tôi mang lại.
          </p>
        </div>
      </div>
    </section>
  );
}
