import type { Timestamp } from './common';

export interface City {
  city_id: number;
  city_name: string;
  image_city?: string;
  region?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
