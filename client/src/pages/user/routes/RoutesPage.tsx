import { useEffect, useState } from "react";
import CardRoutes from "./components/CardRoutes";
import PaginationRoutes from "./components/PaginationRoutes";
import { routesService } from "../../../services/routesService";

export type routesInfomation = {
  route_id: number;
  departure_station_name: string;
  arrival_station_name: string;
  description: string;
}


export default function RoutesPage() {
  const [inforRoutes, setInforRoutes] = useState<routesInfomation[]>([])
  const itemPerPage = 8
  const totalPage = Math.ceil(inforRoutes.length / itemPerPage)
  const [currentPage, setCurrentPage] = useState(1)
  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1)
    }
  }
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  const clickPage = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {

    routesService.getInformationRoutes().then((res) => {
      if (res) {
        setInforRoutes(() => [...res])
      }
    })
  }, [])
  console.log('info', inforRoutes);

  return (
    <section
      className=" max-w-7xl mx-auto py-8 px-3 [@media(min-width:391px)]:px-4 [@media(min-width:769px)]:px-0
      "
    >
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="w-1 h-12 bg-yellow-400"></span>
        <h2
          className="font-bold text-2xl  min-[391px]:text-4xl"
        >
          Tuyến Đường
        </h2>
      </div>

      <CardRoutes listRoutes={inforRoutes} currentPage={currentPage} itemPerPage={itemPerPage} />
      <PaginationRoutes
        currentPage={currentPage}
        totalPage={totalPage}
        nextPage={nextPage}
        prevPage={prevPage}
        clickPage={clickPage}
      />
    </section>
  );
};
