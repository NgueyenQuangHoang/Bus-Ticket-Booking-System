import type { Timestamp, Decimal } from './common';

export type TicketStatus = 'BOOKED' | 'CANCELLED' | string;

export interface Ticket {
  ticket_id: number;
  schedule_id: number;
  seat_id: number;
  departure_time?: Timestamp;
  arrival_time?: Timestamp;
  seat_type?: string;
  price?: Decimal;
  status?: TicketStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
