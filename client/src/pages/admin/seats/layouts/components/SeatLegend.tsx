
import type { SeatType } from '../../../../../types/seat';

interface Props {
  seatTypes: SeatType[];
}

export default function SeatLegend({ seatTypes }: Props) {
    const safeSeatTypes = Array.isArray(seatTypes) ? seatTypes : [];
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
        <h3 className='font-bold mb-6 text-gray-800 text-lg'>Chú thích</h3>
        <div className='space-y-6'>
            {/* Static Legend Item: Seat Not Sold */}
            <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-lg bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-white'>
                   <i className="fa-solid fa-ban text-gray-400"></i>
                </div>
                <div>
                   <span className='font-medium text-gray-700 block'>Ghế không bán</span>
                </div>
            </div>

            {/* Static Legend Item: Selected */}
             <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-lg bg-green-100 border-2 border-green-500 flex items-center justify-center text-green-600'>
                   <i className="fa-solid fa-check"></i>
                </div>
                 <div>
                   <span className='font-medium text-gray-700 block'>Đang chọn</span>
                </div>
            </div>

            {safeSeatTypes.map(type => (
                <div key={type.id || type.seat_type_id} className='flex items-start gap-4'>
                    <div 
                        className='w-12 h-12 flex flex-col items-center justify-center rounded-lg border-2 bg-white shrink-0'
                        style={{ borderColor: type.color || '#d1d5db' }}
                    >
                        {(() => {
                            const typeName = (type.type_name || '').toLowerCase();
                            if (typeName.includes('giường đôi')) {
                                return (
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 border-2 rounded-full" style={{ borderColor: type.color, opacity: 0.6 }}></div>
                                        <div className="w-3 h-3 border-2 rounded-full" style={{ borderColor: type.color, opacity: 0.6 }}></div>
                                    </div>
                                );
                            } else if (typeName.includes('ghế')) {
                                return (
                                    <div className="w-6 h-6 border-2 rounded-md opacity-60" style={{ borderColor: type.color }}></div>
                                );
                            } else {
                                return (
                                    <div className="w-8 h-5 border-2 rounded-md" style={{ borderColor: type.color }}></div>
                                );
                            }
                        })()}
                    </div>
                    <div>
                        <div className='font-medium text-gray-800'>{type.type_name || 'Loại ghế'}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}