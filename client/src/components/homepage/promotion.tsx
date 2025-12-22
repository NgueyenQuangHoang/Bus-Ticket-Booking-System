// đức viết components ko ghi hoa

export default function Promotion() {
  return (
    <div>
       <section className="max-w-7xl mx-auto px-6 pb-12">
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">
                        Ưu Đãi Nổi Bật
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-3">

                    <button className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow text-lg shrink-0 hover:bg-orange-600 transition">
                        ‹
                    </button>

                    <div className="w-full flex-1 overflow-hidden rounded-xl">
                        <img
                            src="https://images.unsplash.com/photo-1522199710521-72d69614c702"
                            alt="Ưu đãi nổi bật"
                            className="w-full h-[200px] object-cover"
                        />
                    </div>

                    <button className="hidden lg:flex w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow text-lg shrink-0 hover:bg-orange-600 transition">
                        ›
                    </button>

                    <div className="flex gap-3 mt-4 lg:hidden justify-center">
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">‹</button>
                        <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow">›</button>
                    </div>

                </div>
            </section>
    </div>
  )
}
