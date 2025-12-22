
import logo from "../../assets/Link.png";

export default function VivuToday() {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-6 py-12 bg-white">

                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Vivutoday Được Nhắc Tên Trên
                    </h2>
                </div>

                <div className="
  flex flex-wrap gap-6
  justify-center
  lg:justify-start lg:ml-22
">

                    <img src={logo} className="h-8 w-24 object-contain" />
                    <img src={logo} className="h-8 w-24 object-contain" />
                    <img
                        src={logo}
                        className="h-8 w-24 object-contain hidden md:block"
                    />
                    <img
                        src={logo}
                        className="h-8 w-24 object-contain hidden md:block"
                    />
                    <img
                        src={logo}
                        className="h-8 w-24 object-contain hidden lg:block"
                    />
                </div>
            </section>
        </div>
    )
}
