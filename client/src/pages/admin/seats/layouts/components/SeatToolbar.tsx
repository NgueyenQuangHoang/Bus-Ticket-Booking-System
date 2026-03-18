import type { BusLayout } from '../../../../../types/seat';

interface Props {
  templates: BusLayout[];
  selectedLayoutId: number | string;
  onLayoutChange: (layoutId: string) => void;
}

export default function SeatToolbar({ templates, selectedLayoutId, onLayoutChange }: Props) {
  return (
    <div className='flex-1 min-w-75'>
      <p className='text-sm font-medium mb-1'>Chọn mẫu sơ đồ:</p>
      <div className='bg-gray-50 rounded-lg px-3 py-2 border flex items-center h-10'>
        <select
          className='bg-transparent w-full outline-none text-sm'
          value={selectedLayoutId}
          onChange={(e) => onLayoutChange(e.target.value)}
        >
          <option value="">Chọn mẫu sơ đồ để cấu hình...</option>
          {templates.map(t => {
            const isGlobal = !t.bus_company_id && !(t as any).company_id;
            return (
              <option key={t.id || t.layout_id} value={String(t.id || t.layout_id)}>
                {t.layout_name}{isGlobal ? ' [Mẫu chung]' : ''} ({t.total_rows}x{t.total_columns}, {t.floor_count} tầng)
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
