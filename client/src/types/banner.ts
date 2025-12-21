import type { Timestamp } from './common';

export interface Banner {
  banner_id: number;
  banner_url?: string;
  start_date?: Timestamp;
  end_date?: Timestamp;
  position?: string;
  link_to?: string;
}
