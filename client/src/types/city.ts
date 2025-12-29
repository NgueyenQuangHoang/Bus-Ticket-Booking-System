import type { Timestamp } from './common';

export interface City {
  city_name: string;
  image_city?: string;
  region?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  id: string| number;
  description: string
}
