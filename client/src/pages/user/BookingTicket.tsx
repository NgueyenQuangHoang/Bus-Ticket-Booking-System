import FilterSidebar from "../../components/BookingTicket/FilterSidebar";
import SortBar from "../../components/BookingTicket/SortBar";
import TripCard from "../../components/BookingTicket/TripCards";
// import BusSearchWidget from "../../components/homepage/BusSearchWidget";
const BookingTicket = () => {
    return (
        <div className="
        w-full flex justify-center bg-gray-50 font-sans text-slate-900 py-10 
        
        ">
<div className="">
    
                {/* Header & Search Bar */}
                <h2 className="text-center text-2xl text-blue-500 font-bold">Hà Nội Đến Hải Phòng</h2>
                
                {/* search */}
                <div className="mt-5 mb-10">
                    {/* cái này chờ minh đức sửa lại responsive nữa là oke nha bạn*/}
                    {/* <BusSearchWidget /> */}
                </div>
    
                <div className="w-full flex justify-center px-5">
                    <SortBar/>
                </div>
    
                {/*  */}
                <div className="md:flex block w-full justify-between mt-10">
                    <div className="w-1/3 md:block hidden px-3">
                        {/* filter */}
                        <FilterSidebar/>
                    </div>
                    <div className="md:w-2/3 px-3 w-full pb-4">
                        {/* trip card */}
                        <TripCard/>
                    </div>
                </div>


    <img src="../../../public/bannerBooking.png" alt="" className="w-full mt-10 px-5 rounded-lg object-cover" />
</div>
        </div>
    );
};

export default BookingTicket