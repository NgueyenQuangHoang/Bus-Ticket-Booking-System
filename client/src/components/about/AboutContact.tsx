export default function AboutContact() {
  return (
    <section className="w-full bg-white font-['Segoe_UI'] pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pt-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="font-bold text-[#FF8D00] text-[24px] lg:text-[36px] leading-[32px] lg:leading-[48px]">
            Liên hệ với chúng tôi
          </h2>
        </div>

        <div className="max-w-[1100px] mx-auto">
          <form className="flex flex-col gap-6 sm:gap-7">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-bold text-[#222222] text-[16px] leading-[24px]"
              >
                Họ Và Tên:
              </label>
              <input
                type="text"
                id="name"
                className="w-full h-12 sm:h-[48px] px-4 border border-[#DDDDDD] rounded-[4px] bg-white shadow-inner focus:outline-none focus:border-[#0094DE] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-bold text-[#222222] text-[16px] leading-[24px]"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-12 sm:h-[48px] px-4 border border-[#DDDDDD] rounded-[4px] bg-white shadow-inner focus:outline-none focus:border-[#0094DE] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-bold text-[#222222] text-[16px] leading-[24px]"
              >
                Số Điện Thoại:
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full h-12 sm:h-[48px] px-4 border border-[#DDDDDD] rounded-[4px] bg-white shadow-inner focus:outline-none focus:border-[#0094DE] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-bold text-[#222222] text-[16px] leading-[24px]"
              >
                Tin Nhắn:
              </label>
              <input
                type="text"
                id="message"
                className="w-full h-12 sm:h-[48px] px-4 border border-[#DDDDDD] rounded-[4px] bg-white shadow-inner focus:outline-none focus:border-[#0094DE] transition-colors"
                required
              />
            </div>

            <div className="flex justify-center mt-2 sm:mt-4">
              <button
                type="submit"
                className="bg-[#1295DB] text-white font-bold uppercase text-[16px] px-10 py-3 rounded-[4px] hover:bg-[#007bb5] transition-colors shadow-md min-w-[169px]"
              >
                Gửi Ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
