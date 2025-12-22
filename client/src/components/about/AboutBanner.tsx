import bgBanner from "../../assets/image/Introduction_page_banner_image.png";
import vivutoday from "../../assets/image/vivutoday-icon.png";
import facebook from "../../assets/image/fb-icon.svg";
import zalo from "../../assets/image/zalo-icon.svg";

export default function AboutBanner() {
  return (
    <section className="relative w-full pt-[30px] pb-[30px] bg-[#D6FAFF] min-h-[400px] lg:min-h-[640px] flex items-center">
      {/* 1. LỚP NỀN */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center lg:bg-right-bottom z-0"
        style={{ backgroundImage: `url(${bgBanner})` }}
      />

      {/* 2. LỚP CONTENT */}
      <div className="container mx-auto px-4 lg:px-[100px] relative z-10">
        <div className="w-full">
          {/* TEXT CONTENT */}
          <div className="mb-4">
            <p className="font-['Segoe_UI'] font-bold leading-tight">
              {/* Giảm size chữ mobile xuống text-[32px] để không bị to quá */}
              <span className="text-[#FF8D00] text-[32px] sm:text-[50px] lg:text-[80px] block">
                Tiện lợi,
                <br />
                tận tâm,
              </span>
              <span className="text-[#0094DE] text-[32px] sm:text-[50px] lg:text-[80px] block">
                an toàn.
              </span>
            </p>
          </div>

          {/* SOCIAL TEXT */}
          <p className="text-black font-bold text-[16px] sm:text-[18px] lg:text-[20px] mb-3">
            Theo dõi chúng tôi tại:
          </p>

          {/* SOCIAL ICONS */}
          <ul className="flex items-center gap-3 sm:gap-4 list-none p-0 m-0">
            <li>
              <a
                href="http://vivutoday.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80"
              >
                {/* FIX LOGIC SIZE:
                   - Mặc định (Mobile nhỏ): h-[30px]
                   - Tablet (sm): h-[40px]
                   - Desktop (lg): h-[50px]
                */}
                <img
                  src={vivutoday}
                  alt="vivutoday"
                  className="h-[30px] sm:h-[40px] lg:h-[50px] w-auto"
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
                {/* FIX LOGIC SIZE:
                   - Mặc định: 35px
                   - Tablet: 50px
                   - Desktop: 60px
                */}
                <img
                  src={facebook}
                  alt="fb"
                  className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] lg:w-[60px] lg:h-[60px]"
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
                  className="w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] lg:w-[60px] lg:h-[60px]"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
