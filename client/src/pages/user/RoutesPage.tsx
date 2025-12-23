import React from 'react'
import CardBusStation from '../../components/busstationpage/CardBusStation';
import PaginationStation from '../../components/busstationpage/PaginationStation';
import CardRoutes from '../../components/routepage/CardRoutes';
import PaginationRoutes from '../../components/routepage/PaginationRoutes';

export default function RoutesPage() {
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

     <CardRoutes />
      <PaginationRoutes />
   
      

    </section>
  );
};
