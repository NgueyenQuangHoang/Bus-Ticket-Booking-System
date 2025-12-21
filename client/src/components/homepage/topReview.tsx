import React from 'react'

export default function TopReview() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-12">

                {/* TITLE */}
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">Top Reviews</h2>
                </div>

                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[340px] lg:ml-12 lg:mr-12">

                    <div className="col-span-2 rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1506973035872-a4f23ef8f7c4"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Sài Gòn</p>
                            <p className="text-xs">287 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Vũng Tàu</p>
                            <p className="text-xs">98 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Đà Lạt</p>
                            <p className="text-xs">87 bài viết</p>
                        </div>
                    </div>

                    <div className="col-span-2 rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Hà Nội</p>
                            <p className="text-xs">612 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Nha Trang</p>
                            <p className="text-xs">557 bài viết</p>
                        </div>
                    </div>

                    <div className="rounded-xl overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-semibold">Đà Nẵng</p>
                            <p className="text-xs">570 bài viết</p>
                        </div>
                    </div>

                </div>
            </section>
    </div>
  )
}
