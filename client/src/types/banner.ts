import type { Timestamp } from './common';

export interface Banner {
  banner_id: number;
  image_url: string;
  position: number;
  target_type: string;
  target_id: number;
  start_date: Timestamp;
  end_date: Timestamp;
}
