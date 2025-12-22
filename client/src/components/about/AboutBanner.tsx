import bgBanner from "../../assets/image/Introduction_page_banner_image.png";
import vivutoday from "../../assets/image/vivutoday-icon.png";
import facebook from "../../assets/image/fb-icon.svg";
import zalo from "../../assets/image/zalo-icon.svg";

export default function AboutBanner() {
  return (
    <section className="relative w-full bg-[#D6FAFF] ">
      {/* Nền banner */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-center lg:bg-bottom-right bg-[length:90%] md:bg-[length:80%] lg:bg-cover"
        style={{ backgroundImage: `url(${bgBanner})` }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[170px] pt-[93px] pb-10 lg:pt-[90px] lg:pb-[40px]">
        <div className="flex flex-col justify-center min-h-[280px] sm:min-h-[340px] lg:min-h-[640px]">
          {/* Tiêu đề chính */}
          <div className="mb-6 sm:mb-8">
            <p className="font-['Segoe_UI'] font-bold leading-tight">
              <span className="block text-[#FF8D00] text-[32px] sm:text-[48px] lg:text-[80px] leading-[40px] sm:leading-[56px] lg:leading-[92px] max-w-[190px] sm:max-w-[220px] lg:max-w-none">
                Tiện lợi,
                <br />
                tận tâm,
              </span>
              <span className="block text-[#0094DE] text-[32px] sm:text-[48px] lg:text-[80px] leading-[40px] sm:leading-[56px] lg:leading-[92px] max-w-[190px] sm:max-w-[220px] lg:max-w-none">
                an toàn.
              </span>
            </p>
          </div>

          {/* Social text */}
          <p className="text-black font-bold text-[14px] sm:text-[16px] lg:text-[20px] mb-3 sm:mb-4">
            Theo dõi chúng tôi tại:
          </p>

          {/* Social icons */}
          <ul className="flex items-center gap-4 sm:gap-5">
            <li>
              <a
                href="http://vivutoday.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity"
              >
                <img
                  src={vivutoday}
                  alt="vivutoday"
                  className="h-[37px] sm:h-[49px] lg:h-[71px] w-auto"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:scale-110 transition-transform"
              >
                <img
                  src={facebook}
                  alt="fb"
                  className="w-[37px] h-[37px] sm:w-[49px] sm:h-[49px] lg:w-[71px] lg:h-[71px]"
                />
              </a>
            </li>
            <li>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:scale-110 transition-transform"
              >
                <img
                  src={zalo}
                  alt="zalo"
                  className="w-[37px] h-[37px] sm:w-[49px] sm:h-[49px] lg:w-[71px] lg:h-[71px]"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
