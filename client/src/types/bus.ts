import type { Timestamp } from './common';

export interface BusCompany {
  bus_company_id: number;
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
  bus_id: number;
  company_id: number;
  name?: string;
  descriptions?: string;
  license_plate?: string;
  capacity?: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface BusStation {
  station_id: number;
  bus_id: number;
}

export interface BusImage {
  bus_image_id: number;
  image_url?: string;
  bus_id: number;
}

export interface BusReview {
  review_id: number;
  user_id: number;
  bus_id: number;
  rating?: number;
  review?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
