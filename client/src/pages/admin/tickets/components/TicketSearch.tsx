import { FormControl, Stack, InputLabel, Select, MenuItem } from '@mui/material';
import type { Bus, BusCompany } from '../../../../types';
import { useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  bus: Bus[],
  companies: BusCompany[]
};

export default function TicketSearch({ value, onChange, bus, companies }: Props) {
  const [idBusCompany, setIdBusCompany] = useState('')
  return (
    <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm'>
      {/* <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div> */}

      <div className="p-4">
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Chọn nhà xe</InputLabel>
            <Select value={idBusCompany} label="Tuổi 1" onChange={(e) => setIdBusCompany(e.target.value)}>
              {
                companies && companies.map(item => (
                  <MenuItem value={item.id}>{item.company_name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Chọn xe</InputLabel>
            <Select disabled={idBusCompany ? false : true} value={value} label="Tuổi 2" onChange={(e) => onChange(e.target.value)}>
              {bus && idBusCompany && bus
              .filter(item => item.bus_company_id == idBusCompany)
              .map(item => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </div>
    </div>
  );
}
