import logo1 from "../../../assets/benxe1.png";
import type { Station } from "../../../types";

interface propInterface {
    stations: Station[]
    itemPerPage: number
    currentPage: number
}

export default function CardBusStation(
    { stations, itemPerPage, currentPage }: propInterface
) {

    return (
        <div
            className="
                    grid
                    grid-cols-1
                    [@media(min-width:391px)]:grid-cols-2
                    [@media(min-width:769px)]:grid-cols-4
                    gap-4
                    [@media(min-width:391px)]:gap-5
                    [@media(min-width:769px)]:gap-6
        " >
            {
                stations
                .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
                .map((item, index) => {

                    return <div
                    key={index}
                        className="
    group bg-white rounded-xl shadow
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl
    overflow-hidden cursor-pointer
  "
                    >
                        <img
                            src={logo1}
                            alt="Nhà xe Thanh Nhung"
                            className="
        w-full object-cover
        h-37.5
        [@media(min-width:391px)]:h-42.5
        [@media(min-width:769px)]:h-45
    "
                        />

                        <div className="p-3 [@media(min-width:391px)]:p-4">
                            <h3 className="font-semibold text-sm [@media(min-width:391px)]:text-base mb-2">
                                {item.station_name}
                            </h3>

                            <div className="flex items-start gap-2 text-xs [@media(min-width:391px)]:text-sm text-gray-600">

                                <p>
                                    Trụ sở chính: {item.location}
                                </p>
                            </div>
                        </div>

                    </div>
                })
            }



        </div>
    );
}
