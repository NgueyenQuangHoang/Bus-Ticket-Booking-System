export default function AboutContact() {
  return (
    <section className="w-full pb-16 pt-4 bg-white font-['Segoe_UI']">
      <div className="container mx-auto px-4 lg:px-[100px]">
        {/* --- TIÊU ĐỀ --- */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#FF8D00]">
            Liên hệ với chúng tôi
          </h2>
        </div>

        {/* --- FORM CONTAINER --- */}
        <div className="max-w-[800px] mx-auto">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-bold text-[#333333] text-[16px]"
              >
                Họ Và Tên:
              </label>
              <input
                type="text"
                id="name"
                className="w-full h-[45px] px-4 border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#0094DE] transition-colors"
                placeholder=""
                required
              />
            </div>

            {/* Input: Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-bold text-[#333333] text-[16px]"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-[45px] px-4 border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#0094DE] transition-colors"
                placeholder=""
                required
              />
            </div>

            {/* Input: Số điện thoại */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-bold text-[#333333] text-[16px]"
              >
                Số Điện Thoại:
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full h-[45px] px-4 border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#0094DE] transition-colors"
                placeholder=""
                required
              />
            </div>

            {/* Textarea: Tin nhắn */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-bold text-[#333333] text-[16px]"
              >
                Tin Nhắn:
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full p-4 border border-[#ddd] rounded-[4px] focus:outline-none focus:border-[#0094DE] transition-colors resize-none"
                placeholder=""
              ></textarea>
            </div>

            {/* Button Submit */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="
                  bg-[#0094DE] text-white font-bold uppercase 
                  text-[16px] px-10 py-3 rounded-[4px]
                  hover:bg-[#007bb5] transition-colors
                  shadow-md
                "
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
