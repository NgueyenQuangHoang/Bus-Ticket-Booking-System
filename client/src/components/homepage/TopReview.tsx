// Data definition - purely content, no style info
const locations = [
    { name: "Sài Gòn", posts: "287 bài viết", img: "https://images.unsplash.com/photo-1506973035872-a4f23ef8f7c4" },
    { name: "Vũng Tàu", posts: "98 bài viết", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { name: "Đà Lạt", posts: "87 bài viết", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { name: "Hà Nội", posts: "612 bài viết", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da" },
    { name: "Quy Nhơn", posts: "81 bài viết", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19" },
    { name: "Nha Trang", posts: "557 bài viết", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
    { name: "Đà Nẵng", posts: "570 bài viết", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482" },
    { name: "Phan Thiết", posts: "276 bài viết", img: "https://images.unsplash.com/photo-1552751118-cfe73e1cf72c" }
];

// Layout configuration - defines the "slots" in the grid 0-7
const LAYOUT_CONFIG = [
    // 0: Sài Gòn slot (Large, Top-Left)
    { className: "col-span-2 row-span-2 h-[360px]", textTop: "274px" },
    // 1: Vũng Tàu slot (Tall, Top-Right)
    { className: "col-span-1 row-span-2 h-[360px]", textTop: "274px" },
    // 2: Đà Lạt slot (Small, Middle-Left)
    { className: "col-span-1 row-span-1 h-[175px]", textTop: "89px" },
    // 3: Hà Nội slot (Large, Middle-Right)
    { className: "col-span-2 row-span-2 h-[360px]", textTop: "274px" },
    // 4: Quy Nhơn slot (Small, Middle-Left-Bottom)
    { className: "col-span-1 row-span-1 h-[175px]", textTop: "89px" }, // Standardized to 89px
    // 5: Nha Trang slot (Large, Bottom-Left)
    { className: "col-span-2 row-span-2 h-[360px]", textTop: "274px" },
    // 6: Đà Nẵng slot (Small, Bottom-Right-Top)
    { className: "col-span-1 row-span-1 h-[175px]", textTop: "89px" },
    // 7: Phan Thiết slot (Small, Bottom-Right-Bottom)
    { className: "col-span-1 row-span-1 h-[175px]", textTop: "89px" },
];

export default function TopReview() {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center gap-2 mb-6 ml-12">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-xl font-semibold">Top Reviews</h2>
                </div>

                {/* Flexible Grid Layout */}
                <div className="grid grid-cols-[320px_440px_320px] gap-[10px] justify-center auto-rows-[175px]">
                    {locations.map((loc, index) => {
                        // Apply layout config cyclically or just for first 8
                        const layout = LAYOUT_CONFIG[index];
                        if (!layout) return null; // Safety check if data exceeds config

                        return (
                            <div key={index} className={`relative rounded-xl overflow-hidden ${layout.className}`}>
                                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                                <div className="absolute left-[20px]" style={{ top: layout.textTop }}>
                                    <h3 className="text-white font-bold text-[32px] leading-[43px]" style={{ fontFamily: 'Segoe UI' }}>
                                        {loc.name}
                                    </h3>
                                    <p className="text-white font-normal text-[20px] leading-[27px]" style={{ fontFamily: 'Segoe UI' }}>
                                        {loc.posts}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    )
}
