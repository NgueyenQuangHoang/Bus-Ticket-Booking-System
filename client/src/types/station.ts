import type { Timestamp } from './common';

export interface Station {
  id: string;
  station_name: string;
  city_id: string;
  image?: string;
  wallpaper?: string;
  description?: string;
  location?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

