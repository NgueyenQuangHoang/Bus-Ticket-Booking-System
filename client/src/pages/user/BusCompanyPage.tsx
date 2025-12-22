import CardBus from "../../components/buscompanypage/CardBus";
import Pagination from "../../components/buscompanypage/Pagination";

const BusCompanyPage = () => {
  return (
    <section
      className=" max-w-7xl mx-auto py-8 px-3 [@media(min-width:391px)]:px-4 [@media(min-width:769px)]:px-0
      "
    >
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="w-1 h-6 bg-yellow-400"></span>
        <h2
          className="font-bold text-xl[@media(min-width:391px)]:text-2xl
          "
        >
          NHÀ XE
        </h2>
      </div>

      <CardBus />
      <Pagination />

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
