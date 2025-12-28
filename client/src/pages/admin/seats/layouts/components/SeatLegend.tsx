import { Paper } from '@mui/material';
import type { SeatType } from '../../../../../types/seat';

interface Props {
  seatTypes: SeatType[];
}

export default function SeatLegend({ seatTypes }: Props) {
  return (
    <Paper className='p-4 shadow-sm rounded-xl border border-gray-100 bg-white'>
        <h3 className='font-semibold mb-4 text-gray-800'>Chú thích loại ghế</h3>
        <div className='space-y-3'>
            {seatTypes.map(type => (
                <div key={type.id || type.seat_type_id} className='flex items-center gap-3 p-2 border rounded-lg bg-gray-50'>
                    <div 
                        className='w-10 h-10 flex flex-col items-center justify-center text-white text-xs font-bold shadow-sm rounded-t-lg rounded-b-md relative'
                        style={{ backgroundColor: type.color }}
                    >
                         <div className="absolute -top-0.5 w-6 h-1 bg-black/10 rounded-full mx-auto"></div>
                    </div>
                    <div>
                        <div className='font-medium text-sm'>{type.type_name}</div>
                        <div className='text-xs text-gray-500'>Hệ số giá: {type.price_multiplier}x</div>
                    </div>
                </div>
            ))}
            
            <div className='flex items-center gap-3 p-2 border rounded-lg border-dashed'>
                 <div className='w-8 h-8 rounded border border-gray-300 flex items-center justify-center bg-gray-50'></div>
                 <span className='font-medium text-sm'>Lối đi</span>
            </div>
             <div className='flex items-center gap-3 p-2 border rounded-lg'>
                  <div className='w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-white text-xs'></div>
                 <span className='font-medium text-sm'>Ghế tài xế</span>
            </div>
        </div>
    </Paper>
  );
}