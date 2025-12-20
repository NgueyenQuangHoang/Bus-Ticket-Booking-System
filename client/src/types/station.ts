import type { Timestamp } from './common';

export interface Station {
  stations_id: number;
  stations_name: string;
  image?: string;
  wallpaper?: string;
  descriptions?: string;
  location?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
