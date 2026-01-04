import type { BusCompany } from "../../../../../types";

export default function ContentBusCompany({busCompany} : {busCompany?: BusCompany}) {
  return (
    <div
      className="
        bg-white mx-auto
        max-w-full
        px-3 py-6
        [@media(min-width:391px)]:max-w-3xl
        [@media(min-width:391px)]:px-4
        [@media(min-width:391px)]:py-8
      "
    >
      {/* INFO */}
      <p className="text-xs [@media(min-width:391px)]:text-sm text-gray-700 leading-relaxed mb-4">
        <strong>Điện thoại:</strong>{busCompany?.contact_phone}<br />
        <strong>Địa chỉ:</strong> {busCompany?.address}
      </p>

      {busCompany?.description && <div className="text-center" dangerouslySetInnerHTML={{__html: busCompany?.description}}>
      </div>}
      {/* <p className="text-xs [@media(min-width:391px)]:text-sm text-gray-700 leading-relaxed mb-6">
        Bến xe Gia Lâm thuộc quận Long Biên, nằm về phía Đông Bắc và cách
        trung tâm thành phố Hà Nội 1,4km. Đây cũng là bến lâu đời cùng với
        nhiều nhà xe vận hành thường xuyên như Chiến Thắng, Hồng Hà,
        Lạng Sơn… Bến xe Gia Lâm phục vụ chủ yếu là di chuyển về các tỉnh
        phía Bắc.
      </p>

      <img src={img1} alt="Khu vực bến xe Gia Lâm" className="w-full rounded mb-6" />

      <p className="text-xs [@media(min-width:391px)]:text-sm text-gray-700 leading-relaxed mb-6">
        Hệ thống giao thông xung quanh có đầy đủ cả đường bộ,
        đường sắt và đường thủy, trong đó đường bộ có tuyến quốc lộ 1A,
        quốc lộ 5 và cao tốc đi Hải Phòng, Lạng Sơn...
      </p>

      <p className="text-xs [@media(min-width:391px)]:text-sm text-gray-700 leading-relaxed mb-6">
        Khu vực các hàng quán phục vụ ăn uống, giải khát được bố trí khoa học,
        đảm bảo vệ sinh và an ninh trật tự.
      </p>

      <img src={img1} alt="Bến xe Gia Lâm" className="w-full rounded mb-6" />

      <h2 className="font-bold text-sm [@media(min-width:391px)]:text-base mb-2">
        *Các tuyến đường và nhà xe hoạt động chính tại bến
      </h2>

      <p className="font-semibold mt-4 text-sm">
        + Bến xe Gia Lâm Hà Nội đi Hải Phòng
      </p>

      <div className="space-y-3 text-xs [@media(min-width:391px)]:text-sm">
        <p className="font-semibold">1. Nhà xe Ô Hô</p>
        <p>Hoạt động chuyên chở từ Hà Nội đi Hải Phòng bằng xe ghế ngồi 29 chỗ.</p>
        <p>Xe chạy từ 06:00 đến 18:30, giá vé khoảng 90.000 đồng/vé.</p>
        <p>Trụ sở chính: 602 Trường Chinh, Q. Kiến An, Hải Phòng.</p>
      </div>

      <figure className="mt-6">
        <img src={img2} alt="Nhà xe Ô Hô" className="w-full rounded" />
        <figcaption className="text-xs text-center text-gray-500 mt-2">
          Nhà xe Ô Hô Hà Nội Hải Phòng
        </figcaption>
      </figure>

      <p className="font-semibold mt-10 text-sm">
        + Bến xe Gia Lâm Hà Nội đi Lào Cai
      </p>

      <div className="space-y-3 text-xs [@media(min-width:391px)]:text-sm">
        <p className="font-semibold">2. Nhà xe Nam Thắng</p>
        <p>Hãng xe Limousine 9 chỗ hiện đại, được nhiều khách hàng yêu thích.</p>
        <p>Giá vé từ 320.000 – 370.000 đồng/vé.</p>
        <p>Xe có wifi, cổng sạc USB, nước uống miễn phí.</p>
      </div>

      <figure className="mt-6">
        <img src={img3} alt="Nhà xe Nam Thắng" className="w-full rounded" />
        <figcaption className="text-xs text-center text-gray-500 mt-2">
          Nhà xe Nam Thắng Hà Nội Lào Cai
        </figcaption>
      </figure> */}
    </div>
  );
}
