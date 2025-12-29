import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Popover, TextField, Checkbox, FormControlLabel, Button, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import type { SeatPosition, SeatType } from '../../../../../types/seat';
import seatService from '../../../../../services/admin/seatService';

interface Props {
  rows: number;
  cols: number;

  positions: SeatPosition[];
  setPositions: React.Dispatch<React.SetStateAction<SeatPosition[]>>;
  activeFloor?: 1 | 2;
}

export default function LayoutPreview({ rows, cols, positions, setPositions, activeFloor = 1 }: Props) {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedPos, setSelectedPos] = useState<SeatPosition | null>(null);

  useEffect(() => {
    // Fetch seat types for selection
    seatService.getAllSeatTypes().then(types => setSeatTypes(types || []));
  }, []);

  // Initialize positions grid when LayoutForm changes (handled by parent passing rows/cols)
  // But here we need to ensure positions exist for current grid size
  // If parent resets positions, we just render.
  
  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, floor: 1|2, row: number, col: number) => {
    const existing = positions.find(p => p.floor === floor && p.row_index === row && p.column_index === col);
    
    const pos = existing || {
        position_id: uuidv4(), // Temporary ID
        layout_id: 0,
        floor, 
        row_index: row, 
        column_index: col,
        is_driver_seat: false,
        is_door: false,
        is_stair: false,
        label: '',
        seat_type_id: ''
    } as SeatPosition;

    setSelectedPos(pos);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPos(null);
  };

  const handleSaveConfig = () => {
    if (!selectedPos) return;

    // Filter out previous version of this position
    const otherPositions = positions.filter(
        p => !(p.floor === selectedPos.floor && p.row_index === selectedPos.row_index && p.column_index === selectedPos.column_index)
    );

    // If it has a label or is a special item, save it. If completely empty, maybe remove it?
    // For now, save if it has content.
    if (selectedPos.label || selectedPos.is_driver_seat || selectedPos.is_door || selectedPos.is_stair || selectedPos.seat_type_id) {
         setPositions([...otherPositions, selectedPos]);
    } else {
         // If "cleared", just remove
         setPositions([...otherPositions]);
    }
    handleClose();
  };
  
  const handleRemoveCell = () => {
      if (!selectedPos) return;
       const otherPositions = positions.filter(
        p => !(p.floor === selectedPos.floor && p.row_index === selectedPos.row_index && p.column_index === selectedPos.column_index)
    );
    setPositions(otherPositions);
    handleClose();
  }

  const renderGrid = (floor: 1|2) => {
    const grid = [];
    for(let r=1; r<=rows; r++) {
        for(let c=1; c<=cols; c++) {
            const pos = positions.find(p => p.floor === floor && p.row_index === r && p.column_index === c);
            const isSelected = selectedPos?.floor === floor && selectedPos?.row_index === r && selectedPos?.column_index === c;
            
            // Determine Style based on content
            let bgClass = "bg-gray-50 hover:bg-gray-100";
            let content = "";

            if (pos) {
                // Remove borderClass override here, handle in className logic
                bgClass = "bg-white";

                if (pos.is_driver_seat) {
                    bgClass = "bg-gray-700 text-white";
                    content = "Tài";
                } else if (pos.is_door) {
                    bgClass = "bg-yellow-50 text-yellow-700";
                    content = "Cửa";
                } else if (pos.is_stair) {
                    bgClass = "bg-gray-200 text-gray-500";
                    content = "|||"; // Stairs icon representation
                } else if (pos.seat_type_id) {
                    // Find Type Color
                    const type = seatTypes.find(t => t.id === pos.seat_type_id || t.seat_type_id === pos.seat_type_id);
                    if (type) {
                        // Use inline style for dynamic color, but fallback class here
                        bgClass = "text-white"; 
                    } else {
                        bgClass = "bg-blue-100 border border-blue-400";
                    }
                    content = pos.label || "Ghế";
                } else if (pos.label) {
                     bgClass = "bg-white border border-gray-300 rounded";
                     content = pos.label;
                }
            } else {
                 // Empty cell
            }

            const typeColor = pos?.seat_type_id ? seatTypes.find(t => t.id === pos.seat_type_id || t.seat_type_id === pos.seat_type_id)?.color : undefined;

            grid.push(
                <div 
                    key={`${floor}-${r}-${c}`}
                    onClick={(e) => handleCellClick(e, floor, r, c)}
                    className={`relative w-12 h-14 flex items-center justify-center cursor-pointer text-xs font-semibold
                        ${bgClass} ${isSelected ? 'ring-2 ring-blue-500 z-10 scale-105' : ''} transition-all duration-200
                        ${pos?.seat_type_id ? 'rounded-t-lg rounded-b-md shadow-sm hover:shadow-md' : 'rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'}
                        ${pos?.is_driver_seat ? 'rounded-full border-none shadow-md' : ''}
                        ${pos?.is_door || pos?.is_stair ? 'border border-gray-200 rounded-sm' : ''}
                    `}
                    style={{ backgroundColor: typeColor && !pos?.is_driver_seat ? typeColor : undefined, color: typeColor ? '#fff' : undefined }}
                >
                    {/* Headrest visual for seats */}
                    {pos?.seat_type_id && (
                        <div className="absolute -top-1 w-8 h-1.5 bg-black/10 rounded-full mx-auto"></div>
                    )}
                    
                    {/* Content */}
                    <span className="z-10">{content}</span>

                    {/* Armrests visual simplified */}
                     {pos?.seat_type_id && (
                        <>
                            <div className="absolute bottom-2 left-0.5 w-1 h-6 bg-black/5 rounded-r"></div>
                            <div className="absolute bottom-2 right-0.5 w-1 h-6 bg-black/5 rounded-l"></div>
                        </>
                    )}
                </div>
            )
        }
    }
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '12px' }}>
            {grid}
        </div>
    );
  }

  return (
    <>
    <div className='flex gap-8 justify-center'>
        {renderGrid(activeFloor || 1)}
    </div>

        {/* Config Popover */}
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <div className='p-3 w-64 space-y-3'>
                <h4 className='font-semibold text-sm mb-2'>Cấu hình vị trí</h4>
                
                <TextField 
                    label="Tên ghế (VD: A1)" 
                    size="small" 
                    fullWidth 
                    value={selectedPos?.label || ''}
                    onChange={(e) => setSelectedPos(prev => prev ? {...prev, label: e.target.value} : null)}
                />

                <FormControl fullWidth size="small">
                    <InputLabel>Loại ghế</InputLabel>
                    <Select
                        value={selectedPos?.seat_type_id || ''}
                        label="Loại ghế"
                        onChange={(e) => setSelectedPos(prev => prev ? {...prev, seat_type_id: e.target.value} : null)}
                    >
                        <MenuItem value="">Trống</MenuItem>
                        {seatTypes.map(type => (
                            <MenuItem key={type.id || type.seat_type_id} value={type.id || type.seat_type_id}>
                                <div className='flex items-center gap-2'>
                                    <div className='w-3 h-3 rounded-full' style={{backgroundColor: type.color}}></div>
                                    {type.type_name}
                                </div>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                    <FormControlLabel 
                        control={<Checkbox 
                            size="small" 
                            checked={selectedPos?.is_driver_seat || false}
                            onChange={(e) => setSelectedPos(prev => prev ? {...prev, is_driver_seat: e.target.checked} : null)}
                        />} 
                        label={<span className='text-xs'>Ghế tài xế</span>} 
                    />
                     <FormControlLabel 
                        control={<Checkbox 
                            size="small" 
                            checked={selectedPos?.is_door || false}
                            onChange={(e) => setSelectedPos(prev => prev ? {...prev, is_door: e.target.checked} : null)}
                        />} 
                        label={<span className='text-xs'>Cửa xe</span>} 
                    />
                     <FormControlLabel 
                        control={<Checkbox 
                            size="small" 
                            checked={selectedPos?.is_stair || false}
                            onChange={(e) => setSelectedPos(prev => prev ? {...prev, is_stair: e.target.checked} : null)}
                        />} 
                        label={<span className='text-xs'>Cầu thang</span>} 
                    />
                </div>
                
                <Divider />
                
                <div className='flex justify-between'>
                    <Button size="small" color="error" onClick={handleRemoveCell}>Xóa</Button>
                    <Button size="small" variant="contained" onClick={handleSaveConfig}>Xác nhận</Button>
                </div>
            </div>
        </Popover>
    </>
  );
}
