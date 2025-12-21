import type { Timestamp } from './common';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  status?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface Role {
  role_id: number;
  role_name: string;
}

export interface UserRole {
  user_id: number;
  role_id: number;
}
