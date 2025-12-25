import img24h from "../../../../assets/companies/24h.png";
import imgVtc from "../../../../assets/companies/vtc.png";
import imgEva from "../../../../assets/companies/eva.png";
import imgAfamily from "../../../../assets/companies/afamily.png";
import imgBrvt from "../../../../assets/companies/brvt.png";
import imgDn from "../../../../assets/companies/dn.png";

export default function VivuToday() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <div className="flex items-center gap-2 mb-8 ml-15">
                <span className="w-1 h-6 bg-orange-500 rounded"></span>
                <h2 className="text-xl font-bold uppercase text-[#111111]">
                    Vivutoday Được Nhắc Tên Trên
                </h2>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-8 ml-15 pr-15">
                <img src={img24h} alt="24h" className="h-10 object-contain transition-all duration-300 cursor-pointer" />
                <img src={imgVtc} alt="VTC News" className="h-8 object-contain transition-all duration-300 cursor-pointer" />
                <img src={imgEva} alt="Eva.vn" className="h-10 object-contain transition-all duration-300 cursor-pointer" />
                <img src={imgAfamily} alt="Afamily" className="h-8 object-contain transition-all duration-300 cursor-pointer" />
                <img src={imgBrvt} alt="Bà Rịa Vũng Tàu" className="h-10 object-contain transition-all duration-300 cursor-pointer" />
                <img src={imgDn} alt="Đà Nẵng Online" className="h-8 object-contain transition-all duration-300 cursor-pointer" />
            </div>
        </section>
    );
}
