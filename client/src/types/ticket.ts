import type { Timestamp, Decimal } from './common';

export type TicketStatus = 'BOOKED' | 'CANCELLED' | string;

export interface Ticket {
  id: string | number;
  ticket_id?: string | number; // Alias or for compatibility
  schedule_id: string | number;
  seat_id: string | number;
  user_id?: string;
  code?: string;
  departure_time?: Timestamp; // From schedule usually, but maybe cached
  arrival_time?: Timestamp;
  seat_type?: string;
  price?: number;
  status?: TicketStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  // Expanded fields
  schedule?: any; // Define strict Schedule type if possible
  seat?: any;
}
