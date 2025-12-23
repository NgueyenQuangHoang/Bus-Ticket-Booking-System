export default function Pagination() {
    return (
        <div
            className="
        flex justify-center items-center mt-6
        gap-1
        [@media(min-width:391px)]:gap-2
        text-xs
        [@media(min-width:391px)]:text-sm
      "
        >
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer">‹</button>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer ">1</button>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer ">2</button>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer">3</button>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer">4</button>
            <span className="px-1">...</span>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center
  rounded-full
  border border-[2px] border-black
  hover:bg-[#1295db] hover:text-white cursor-pointer">149</button>
            <button className="  w-7 h-7
  [@media(min-width:391px)]:w-8
  [@media(min-width:391px)]:h-8
  flex items-center justify-center 
  rounded-full border border-[2px] border-black hover:bg-[#1295db] hover:text-white cursor-pointer">›</button>
        </div>
    );
}
