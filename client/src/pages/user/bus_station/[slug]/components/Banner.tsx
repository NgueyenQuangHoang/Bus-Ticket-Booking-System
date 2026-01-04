import type { Station } from "../../../../../types";

export default function BannerBusStationDetails({station} : {station?: Station}) {
  return (
    <div
      className="
        w-full relative
        h-[200px]
        [@media(min-width:391px)]:h-[260px]
        [@media(min-width:769px)]:h-[320px]
      "
    >
      <img
        src={station?.image}
        alt="Bến xe Gia Lâm"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-3 [@media(min-width:391px)]:px-4">
        <h1
          className="
            text-white font-semibold text-center max-w-3xl
            text-base
            [@media(min-width:391px)]:text-lg
            [@media(min-width:769px)]:text-xl
          "
        >
          {station?.station_name}, {station?.location}
        </h1>
      </div>
    </div>
  );
}
