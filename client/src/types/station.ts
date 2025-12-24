import type { Timestamp } from './common';

export interface Station {
  station_id: number;
  station_name: string;
  city_id: number;
  image?: string;
  wallpaper?: string;
  description?: string;
  location?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
