import { useEffect, useState } from "react";
import CardBus from "./components/CardBus";
import Pagination from "./components/Pagination";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchBusCompanies } from "../../../slices/busCompanySlice";

const BusCompanyPage = () => {
  const {companies: listBusCompanies} = useAppSelector(state => state.busCompany)
  const dispatch = useAppDispatch()
  const itemPerPage = 8
  const totalPage = Math.ceil(listBusCompanies.length / itemPerPage)
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
    dispatch(fetchBusCompanies())
  }, [dispatch])

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
          NHÀ XE
        </h2>
      </div>

      {listBusCompanies ? <CardBus busCompanies={listBusCompanies} itemPerPage={itemPerPage} currentPage={currentPage} /> : <></>}
      <Pagination
        clickPage={clickPage}
        currentPage={currentPage}
        nextPage={nextPage}
        prevPage={prevPage}
        totalPage={totalPage}
      />

      <p
        className="
          text-center text-gray-500 mt-4 max-w-4xl mx-auto text-xs[@media(min-width:391px)]:text-sm "
      >
        Nhà xe – Vivutoday.com | Hệ thống đặt vé xe online cao cấp,
        dễ dàng tra cứu giá vé, lịch trình, số điện thoại,
        tuyến đường của 1000+ hãng xe chất lượng tốt nhất.
      </p>
    </section>
  );
};

export default BusCompanyPage;
