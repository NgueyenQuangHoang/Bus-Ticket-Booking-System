import type { Timestamp, Decimal } from './common';

export interface Route {
  route_id: number;
  departure_station_id: number;
  arrival_station_id: number;
  base_price?: Decimal;
  duration?: number; // minutes
  distance?: number; // km
  total_bookings?: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  description: string
}

export interface PopularRoute {
    popular_route_id: number;
    route_id: number;
    image_url: string;
    priority: number;
}

export type ScheduleStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED' | string;

export interface Schedule {
  schedule_id: number;
  route_id: number;
  bus_id: number;
  departure_time?: Timestamp;
  arrival_time?: Timestamp;
  available_seat?: number;
  total_seats?: number;
  status?: ScheduleStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface CancellationPolicy {
  cancellation_policies_id: number;
  descriptions?: string;
  route_id: number;
  cancellation_time_limit?: number; // minutes
  refunc_percentage?: number; // percent
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
