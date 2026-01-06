import type { Timestamp, Decimal } from './common';

export interface SeatType {
  seat_type_id: number | string; // ID can be string from JSON server often
  type_name: string;
  description?: string;
  price_multiplier: number;
  color: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id?: string | number; // For compatibility
}

export interface BusLayout {
  layout_id: number | string;
  layout_name: string;
  total_rows: number;
  total_columns: number;
  floor_count: 1 | 2;
  total_seats: number;
  is_template?: boolean;
  bus_company_id?: string | number;
  company_id?: string | number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id?: string | number;
}

export interface SeatPosition {
  position_id: number | string;
  layout_id: number | string; // Linked to Layout, not Bus directly for templates
  seat_id?: number | string; // Nullable if it's just a position in layout
  floor: 1 | 2;
  row_index: number;
  column_index: number;
  seat_type_id?: number | string; // Default type for this position
  is_driver_seat?: boolean;
  is_door?: boolean;
  is_stair?: boolean;
  is_aisle?: boolean;
  label?: string; // e.g. A1, B2
  status?: 'ACTIVE' | 'MAINTENANCE';
  id?: string | number;
}

export interface Seat {
  id: string;
  bus_id: string;
  seat_number: string;
  seat_label: string; // Display label like A1
  seat_type_id: string; 
  price_extra?: number;
  is_available_for_booking: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'MAINTENANCE'; // Keep status for generic usage, though it might come from seat_schedules in reality
  created_at?: Timestamp;
  updated_at?: Timestamp;
}


