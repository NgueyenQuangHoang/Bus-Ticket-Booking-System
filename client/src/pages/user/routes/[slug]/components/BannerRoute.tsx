import type { City } from "../../../../../types";

interface PropType  {
    departureCity?: City,
    arrivalCity?: City,
}

export default function BannerRoute({arrivalCity, departureCity} : PropType) {
    return (
        <div
            className=" w-full relative
        h-[200px] [@media(min-width:391px)]:h-[260px] [@media(min-width:769px)]:h-[320px] cursor-pointer "
        >
            <img
                src={''}
                alt="Nhà xe"
                className="w-full h-full object-cover "
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-3 min-[391px]:px-4">
                <h2
                    className=" text-white text-xs font-semibold tracking-widest mb-2 uppercase "
                >
                    Tuyến Đường
                </h2>
                <h1
                    className="text-white font-semibold text-center
      max-w-3xl text-base min-[391px]:text-lg min-[769px]:text-xl ">
                Tuyến Đường từ {departureCity?.city_name} đến {arrivalCity?.city_name}
                </h1>
            </div>


        </div>
    );
}
