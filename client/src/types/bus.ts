import type { Timestamp } from './common';

export interface BusCompany {
  bus_company_id: string | number; // Changed from number
  id?: string;
  company_name: string;
  image?: string;
  description?: string;
  rating?: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;

  license_number: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface Bus {
  bus_id: string | number; // Changed from number
  company_id: string | number; // Changed from number
  bus_company_id?: string | number; // Changed from number
  name?: string;
  descriptions?: string;
  license_plate?: string;
  capacity?: number;
  layout_id?: number | string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id?: string | number;
  vehicle_type_id?: string | number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'MAINTENANCE';
}

export interface BusStation {
  station_id: string | number;
  bus_id: string | number; // Changed from number
}

export interface BusImage {
  bus_image_id: string | number; // Changed from number
  id?: string;
  image_url?: string;
  bus_id: string | number; // Changed from number
}

export interface BusReview {
  review_id: string | number;
  user_id: string | number;
  bus_id: number;
  rating?: number;
  review?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface BusLayout {
  layout_id: number;
  layout_name: string;
  total_rows: number;
  total_columns: number;
  floor_count: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id?: string;
}
