import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SeatPosition, SeatType } from '../../../../../types/seat';
import seatService from '../../../../../services/admin/seatService';
import SeatCell from './SeatCell';
import SeatAction from './SeatAction';

interface Props {
  rows: number;
  cols: number;
  positions: SeatPosition[];
  setPositions: React.Dispatch<React.SetStateAction<SeatPosition[]>>;
  activeFloor: 1 | 2;
}

export default function SeatGrid({ rows, cols, positions, setPositions, activeFloor }: Props) {
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedPos, setSelectedPos] = useState<SeatPosition | null>(null);

  useEffect(() => {
    seatService.getAllSeatTypes().then(types => setSeatTypes(types || []));
  }, []);

  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
    const existing = positions.find(p => p.floor === activeFloor && p.row_index === row && p.column_index === col);
    
    const pos = existing || {
      position_id: uuidv4(),
      layout_id: 0,
      floor: activeFloor, 
      row_index: row, 
      column_index: col,
      is_driver_seat: false,
      is_door: false,
      is_stair: false,
      label: '',
      seat_type_id: ''
    } as SeatPosition;

    setSelectedPos(pos);
    setAnchorEl(event.currentTarget as HTMLDivElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPos(null);
  };

  const handleSave = (pos: SeatPosition) => {
    const otherPositions = positions.filter(
      p => !(p.floor === pos.floor && p.row_index === pos.row_index && p.column_index === pos.column_index)
    );

    if (pos.label || pos.is_driver_seat || pos.is_door || pos.is_stair || pos.is_aisle || pos.seat_type_id) {
      setPositions([...otherPositions, pos]);
    } else {
      setPositions([...otherPositions]);
    }
    handleClose();
  };

  const handleRemove = () => {
    if (!selectedPos) return;
    const otherPositions = positions.filter(
      p => !(p.floor === selectedPos.floor && p.row_index === selectedPos.row_index && p.column_index === selectedPos.column_index)
    );
    setPositions(otherPositions);
    handleClose();
  };

  // Build grid
  const grid = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const pos = positions.find(p => p.floor === activeFloor && p.row_index === r && p.column_index === c);
      const isSelected = selectedPos?.floor === activeFloor && selectedPos?.row_index === r && selectedPos?.column_index === c;
      
      grid.push(
        <SeatCell
          key={`${activeFloor}-${r}-${c}`}
          position={pos || null}
          seatTypes={seatTypes}
          isSelected={isSelected}
          onClick={(e) => handleCellClick(e, r, c)}
        />
      );
    }
  }

  return (
    <>
      <div 
        className='flex justify-center'
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '12px' }}
      >
        {grid}
      </div>

      <SeatAction
        anchorEl={anchorEl}
        position={selectedPos}
        seatTypes={seatTypes}
        onClose={handleClose}
        onSave={handleSave}
        onRemove={handleRemove}
      />
    </>
  );
}
