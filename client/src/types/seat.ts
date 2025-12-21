import type { Timestamp, Decimal } from './common';

export type SeatType = 'LUXURY' | 'VIP' | 'STANDARD' | string;

export interface Seat {
  seat_id: number;
  bus_id: number;
  seat_number?: string;
  seat_type?: SeatType;
  status?: string;
  price_for_seat_type?: Decimal;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
