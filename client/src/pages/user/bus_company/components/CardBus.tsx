import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/OIP.png";
import logo1 from "../../../../assets/Symbol.png";
import type { BusCompany } from "../../../../types";

interface propType {
  busCompanies: BusCompany[]
  itemPerPage: number
  currentPage: number
}

export default function CardBus({ busCompanies, itemPerPage, currentPage }: propType) {
  const navigate = useNavigate()
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
      "
    >
      {
        busCompanies
          .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
          .map((item, index) => (
            <div
              key={index}
              className="
    group bg-white rounded-xl shadow
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl
    overflow-hidden cursor-pointer
  "
              onClick={() => { navigate('/detailBusCompany/'+item.id) }}
            >
              <img
                src={logo}
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
                  {item.company_name}
                </h3>
                <div className="flex items-start gap-2 text-xs [@media(min-width:391px)]:text-sm text-gray-600">
                  <img
                    src={logo1}
                    alt="location"
                    className="w-3 h-3 mt-1"
                  />
                  <p>
                    Trụ sở chính: {item.address}
                  </p>
                </div>
              </div>
            </div>
          ))
      }
    </div>
  );
}
