import { useEffect, useState } from "react";
import { cityService } from "../../../../services/cityService";
import type { City } from "../../../../types";

// Layout configuration using aspect ratios instead of fixed heights
// Grid uses 3 columns with percentage-based widths
const LAYOUT_CONFIG = [
    // Slot 0: Large (2 cols, 2 rows) - aspect ratio ~2.05:1
    { className: "col-span-2 row-span-2", aspectRatio: "2.05 / 1" },
    // Slot 1: Tall (1 col, 2 rows) - aspect ratio ~0.89:1
    { className: "col-span-1 row-span-2", aspectRatio: "0.89 / 1" },
    // Slot 2: Small (1 col, 1 row) - aspect ratio ~1.83:1
    { className: "col-span-1 row-span-1", aspectRatio: "1.83 / 1" },
    // Slot 3: Large (2 cols, 2 rows)
    { className: "col-span-2 row-span-2", aspectRatio: "2.05 / 1" },
    // Slot 4: Small (1 col, 1 row)
    { className: "col-span-1 row-span-1", aspectRatio: "1.83 / 1" },
    // Slot 5: Large (2 cols, 2 rows)
    { className: "col-span-2 row-span-2", aspectRatio: "2.05 / 1" },
    // Slot 6: Small (1 col, 1 row)
    { className: "col-span-1 row-span-1", aspectRatio: "1.83 / 1" },
    // Slot 7: Small (1 col, 1 row)
    { className: "col-span-1 row-span-1", aspectRatio: "1.83 / 1" },
];

const MAX_ITEMS = LAYOUT_CONFIG.length;

const buildPostsLabel = (cityName: string, seed: number) => {
    const normalizedName = cityName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const hash = normalizedName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = 80 + ((hash + seed * 31) % 600);
    return `${count} bài viết`;
};

export default function TopReview() {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadCities = async () => {
            try {
                const data = await cityService.getAllCities();
                if (!active) return;
                const withImages = (data ?? []).filter((city): city is City & { image_city: string } => Boolean(city.image_city));
                const sorted = [...withImages].sort((a, b) => a.city_name.localeCompare(b.city_name, "vi", { sensitivity: "base" }));
                setCities(sorted.slice(0, MAX_ITEMS));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                if (!active) return;
                setCities([]);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadCities();

        return () => {
            active = false;
        };
    }, []);

    const preparedLocations = cities
        .map((city, index) => ({
            key: city.city_id,
            name: city.city_name,
            posts: buildPostsLabel(city.city_name, city.city_id),
            img: city.image_city,
            layout: LAYOUT_CONFIG[index],
        }))
        .filter((item) => item.layout);

    if (!isLoading && preparedLocations.length === 0) {
        return null;
    }

    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex items-center gap-2 mb-4 sm:mb-6 ml-2 sm:ml-16.5">
                    <span className="w-1 h-6 bg-orange-500 rounded"></span>
                    <h2 className="text-lg sm:text-xl font-semibold">Top Reviews</h2>
                </div>

                {/* Responsive Grid Layout - scales proportionally */}
                <div
                    className="w-full max-w-[1100px] mx-auto grid gap-[2%] sm:gap-[1%]"
                    style={{
                        gridTemplateColumns: '29.6% 40.8% 29.6%',
                    }}
                >
                    {isLoading && (
                        <div className="col-span-3 text-center text-gray-500 py-12">Đang tải địa điểm...</div>
                    )}

                    {!isLoading && preparedLocations.map((loc) => (
                        <div
                            key={loc.key}
                            className={`relative rounded-lg sm:rounded-xl overflow-hidden ${loc.layout?.className}`}
                            style={{ aspectRatio: loc.layout?.aspectRatio }}
                        >
                            <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                            {/* Text overlay positioned at bottom with responsive sizing */}
                            <div className="absolute left-[5%] bottom-[8%]">
                                <h3
                                    className="text-white font-bold text-base sm:text-xl md:text-2xl lg:text-[32px] leading-tight"
                                    style={{ fontFamily: 'Segoe UI' }}
                                >
                                    {loc.name}
                                </h3>
                                <p
                                    className="text-white font-normal text-xs sm:text-sm md:text-base lg:text-[20px] leading-tight"
                                    style={{ fontFamily: 'Segoe UI' }}
                                >
                                    {loc.posts}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
