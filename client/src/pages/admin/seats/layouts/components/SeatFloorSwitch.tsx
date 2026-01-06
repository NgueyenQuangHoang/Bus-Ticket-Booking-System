interface Props {
  activeFloor: 1 | 2;
  floorCount: number;
  onFloorChange: (floor: 1 | 2) => void;
}

export default function SeatFloorSwitch({ activeFloor, floorCount, onFloorChange }: Props) {
  return (
    <div className='flex bg-gray-100 rounded-lg p-1'>
      <button 
        onClick={() => onFloorChange(1)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFloor === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
      >
        Tầng 1
      </button>
      {floorCount === 2 && (
        <button 
          onClick={() => onFloorChange(2)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFloor === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          Tầng 2
        </button>
      )}
    </div>
  );
}