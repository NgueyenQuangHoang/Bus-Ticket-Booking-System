interface PropType {
    totalPage: number
    currentPage: number
    nextPage: () => void
    prevPage: () => void
    clickPage: (page: number) => void
}


export default function PaginationRoutes(
    { totalPage, currentPage, nextPage, prevPage, clickPage }: PropType
) {
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
            <button
                className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-black
                hover:bg-[#1295db] hover:text-white 
                disabled:opacity-50 
                disabled:cursor-not-allowed 
                disabled:hover:bg-transparent 
                disabled:hover:text-black
                cursor-pointer" // cursor-pointer sẽ bị ghi đè bởi disabled:cursor-not-allowed
                disabled={currentPage === 1}
                onClick={() => prevPage()}
            >
                &lt;
            </button>

            {Array.from({ length: totalPage }, (_, index) => index + 1).map(page => (
                <button key={page} className="  w-7 h-7
                [@media(min-width:391px)]:w-8
                [@media(min-width:391px)]:h-8
                flex items-center justify-center
                rounded-full border-2 border-black
                hover:bg-[#1295db] hover:text-white cursor-pointer"
                    onClick={() => {
                        clickPage(page)
                    }}
                >{page}
                </button>
            ))}

            <button
                className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-black
                hover:bg-[#1295db] hover:text-white 
                disabled:opacity-50 
                disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                disabled:hover:text-black
                cursor-pointer"
                disabled={currentPage === totalPage}
                onClick={() => nextPage()}
            >
                &gt;
            </button>
        </div>
    );
}
